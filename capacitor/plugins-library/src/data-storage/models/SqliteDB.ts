import {KrikooUtils} from '../../models/KrikooUtils';

import {DataStorageError} from './DataStorageError';

export class SqliteDB {

    private readonly dbName: string;
    private readonly id: number;
    private readonly tableName: string;
    private db: IDBDatabase = null;

    constructor(dbName: string, tableName: string) {
        this.dbName = dbName;
        this.tableName = tableName;
        this.id = new Date().getTime();
    }

    public close(): void {
        try {
            this.db.close();
            this.db = null;
            KrikooUtils.log(this.id + 'DATA STORAGE', `${this.dbName}/${this.tableName}: Successfully closed connection to database.`);
        } catch (error) {
            KrikooUtils.log(this.id + 'DATA STORAGE', `${this.dbName}/${this.tableName}: Error closing database.`, error);
        }
    }

    public createTable(): Promise<string> {
        const version: number = new Date().getTime();
        const idbOpenDBRequest: IDBOpenDBRequest = indexedDB.open(this.dbName, version);
        return this.processOpenForCreateTable(idbOpenDBRequest);
    }

    public deleteRow(key: string): Promise<string> {
        if (!this.existsTable()) {
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: DELETE statement could not be prepared.`,);
            return Promise.resolve(DataStorageError.TableNotFound);
        } else {
            try {
                const transaction: IDBTransaction = this.db.transaction([this.tableName], "readwrite");
                const objectStore: IDBObjectStore = transaction.objectStore(this.tableName);
                return this.processDeleteRow(objectStore.delete(key), key);
            } catch (e) {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Could not delete row.`, e);
                return Promise.resolve(DataStorageError.DeleteStatement);
            }
        }
    }

    public dropTable(): Promise<string> {
        const version: number = new Date().getTime();
        const idbOpenDBRequest: IDBOpenDBRequest = indexedDB.open(this.dbName, version);
        return this.processDropTableRequest(idbOpenDBRequest);
    }

    public existsDatabase(): Promise<string> {
        let idbOpenDBRequest: IDBOpenDBRequest = indexedDB.open(this.dbName);
        return this.processExistsDatabaseRequest(idbOpenDBRequest);
    }

    public insert(key: string, value: any): Promise<string> {
        try {
            const idbObjectStore: IDBObjectStore = this.db
                .transaction(this.tableName, "readwrite")
                .objectStore(this.tableName);
            idbObjectStore.put({key, value});
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Successfully inserted or replaced row.`);
            return Promise.resolve(null);
        } catch (e) {
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: INSERT OR REPLACE statement could not be prepared.`, e);
            return Promise.resolve(DataStorageError.InsertOrReplace);
        }
    }

    public open(): Promise<string> {
        let idbOpenDBRequest: IDBOpenDBRequest = indexedDB.open(this.dbName);
        return this.processOpenRequest(idbOpenDBRequest);
    }

    public removeDatabase(): Promise<string> {
        try {
            const idbOpenDBRequest: IDBOpenDBRequest = indexedDB.deleteDatabase(this.dbName);
            return this.processRemoveDatabaseRequest(idbOpenDBRequest);
        } catch (error) {
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: REMOVE DATABASE statement could not be prepared.`, error);
            return Promise.resolve(DataStorageError.RemoveDatabase);
        }
    }

    public select(key: string): Promise<{ value: any } | string> {
        if (!this.existsTable()) {
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: SELECT statement could not be prepared.`,);
            return Promise.resolve(DataStorageError.TableNotFound);
        } else {
            try {
                const transaction: IDBTransaction = this.db.transaction([this.tableName]);
                const objectStore: IDBObjectStore = transaction.objectStore(this.tableName);
                const request: IDBRequest = objectStore.get(key);
                return this.processSelect(request, key);
            } catch (error) {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: SELECT statement could not be prepared.`, error);
                return Promise.resolve(DataStorageError.SelectStatement);
            }
        }
    }

    private async processOpenForCreateTable(idbOpenDBRequest: IDBOpenDBRequest): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            idbOpenDBRequest.onsuccess = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Successfully opened connection to database for create.`);
                this.db = event.target.result;
                resolve(null);
            };
            idbOpenDBRequest.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Error opening database for create.`, event.target);
                resolve(DataStorageError.OpenDatabase);
            };
            idbOpenDBRequest.onupgradeneeded = async (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Successfully upgraded needed connection to database for create.`);
                this.db = event.target.result;
                try {
                    if (!this.existsTable()) {
                        const objectStore: IDBObjectStore = this.db.createObjectStore(this.tableName, {keyPath: 'key'});
                        objectStore.createIndex('value', 'value', {unique: false});
                        const errorMessage: string = await this.processCreateTableTransaction(objectStore.transaction);
                        if (errorMessage) {
                            resolve(errorMessage);
                            this.abortTransaction(event);
                        }
                    }
                } catch (error) {
                    KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: CREATE TABLE statement could not be prepared.`, error);
                    resolve(DataStorageError.CreateTableStatement);
                    this.abortTransaction(event);
                }
            }
        });
    }

    private processSelect(idbRequest: IDBRequest, key: string): Promise<{ value: any } | string> {
        return new Promise<{ value: any } | string>((resolve) => {
            idbRequest.onsuccess = (event: Event | any) => {
                const result: any = event.target.result;
                if (!result) {
                    KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: SELECT statement could not be prepared.`);
                    resolve(DataStorageError.KeyNotFound);
                } else {
                    KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Successfully got key.`);
                    resolve(result);
                }
            };
            idbRequest.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Error gotten key.`, event.target);
                resolve(DataStorageError.Select);
            }
        });
    }

    private abortTransaction(event: any): void {
        try {
            event.target.transaction.abort();
        } catch (error) {
            KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Error aborting transaction.`, error);
        }
        this.db = null;
    }

    private existsTable(): boolean {
        const objectStoreNames: Array<String> = Array.from(this.db.objectStoreNames);
        const exists: boolean = objectStoreNames.includes(this.tableName);
        KrikooUtils.log(this.id + 'DATA STORAGE', `${this.dbName}/${this.tableName}: ${exists ? 'Exists.' : 'Does not exist.'}`, objectStoreNames);
        return exists;
    }

    private processExistsDatabaseRequest(idbOpenDBRequest: IDBOpenDBRequest): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            idbOpenDBRequest.onsuccess = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Database exists.`);
                event.target.result.close();
                resolve(null);
            };
            idbOpenDBRequest.onerror = () => {
                resolve(DataStorageError.DatabaseNotFound);
            };
            idbOpenDBRequest.onupgradeneeded = async (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Database does not exist.`);
                event.target.transaction.abort();
            }
        });
    }

    private processCreateTableTransaction(idbTransaction: IDBTransaction): Promise<string> {
        return new Promise<string>((resolve) => {
            idbTransaction.oncomplete = () => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Successfully created table.`);
                resolve(null);
            };
            idbTransaction.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Table could not be created.`, event.target);
                resolve(DataStorageError.CreateTable);
            }
        });
    }

    private processDeleteRow(request: IDBRequest, key: string): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            request.onsuccess = () => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Successfully deleted row.`);
                resolve(null);
            };
            request.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}/${key}: Could not delete row.`, event.target);
                resolve(DataStorageError.Delete);
            }
        });
    }

    private processDropTableRequest(idbOpenDBRequest: IDBOpenDBRequest): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            idbOpenDBRequest.onsuccess = () => resolve(null);
            idbOpenDBRequest.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Error opening database for drop.`, event.target);
                resolve(DataStorageError.OpenDatabase);
            };
            idbOpenDBRequest.onupgradeneeded = async (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Successfully upgraded needed connection to database for drop.`);
                this.db = event.target.result;
                if (!this.existsTable()) {
                    KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: DROP TABLE statement could not be prepared.`);
                    resolve(DataStorageError.TableNotFound);
                    this.abortTransaction(event);
                } else {
                    try {
                        this.db.deleteObjectStore(this.tableName);
                        KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Successfully dropped row.`);
                    } catch (e) {
                        KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}/${this.tableName}: Table could not be dropped.`, e);
                        resolve(DataStorageError.DropTableStatement);
                        this.abortTransaction(event);
                    }
                }
            }
        });
    }

    private processOpenRequest(idbOpenDBRequest: IDBOpenDBRequest): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            idbOpenDBRequest.onsuccess = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Successfully opened connection to database.`);
                this.db = event.target.result;
                resolve(null);
            };
            idbOpenDBRequest.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Error opening database.`, event.target);
                resolve(DataStorageError.OpenDatabase);
            };
        });
    }

    private processRemoveDatabaseRequest(idbOpenDBRequest: IDBOpenDBRequest): Promise<string> {
        return new Promise<string>((resolve: (value: string | PromiseLike<string>) => void) => {
            idbOpenDBRequest.onsuccess = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}: Successfully deleted database.`);
                this.db = event.target.result;
                resolve(null);
            };
            idbOpenDBRequest.onerror = (event: Event | any) => {
                KrikooUtils.log(this.id + " DATA STORAGE", `${this.dbName}:  Database can not be deleted.`, event.target);
                resolve(DataStorageError.OpenDatabase);
            };
        });
    }

}
