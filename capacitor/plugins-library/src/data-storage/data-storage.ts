import {Capacitor, Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {DataStoragePlugin} from '../definitions';

import {DataBaseOptions} from './models/DataBaseOptions';
import {DeleteOptions} from './models/DeleteOptions';
import {DropOptions} from './models/DropOptions';
import {RetrieveOptions} from './models/RetrieveOptions';
import {StoreOptions} from './models/StoreOptions';
import {DataStorageError} from './models/DataStorageError';
import {SqliteDB} from './models/SqliteDB';
import {KrikooUtils} from '../models/KrikooUtils';
import {DataStorageUtils} from './data-storage.utils';

export class DataStorageWeb extends WebPlugin implements DataStoragePlugin {

    private dbName: string = "datastorage";

    constructor() {
        super({
            name: 'DataStorage',
            platforms: ['web']
        });
    }

    async database(options: DataBaseOptions): Promise<{}> {
        KrikooUtils.debug = options.debug;

        const name = options.name;
        if (!name) {
            return DataStorageUtils.error(DataStorageError.EmptyDatabaseName);
        }
        this.dbName = name;
        return DataStorageUtils.success({});
    }

    async delete(options: DeleteOptions): Promise<{}> {
        const table: string = options.table;
        if (!table) {
            return DataStorageUtils.error(DataStorageError.EmptyTable);
        }

        const key: string = options.key;
        if (!key) {
            return DataStorageUtils.error(DataStorageError.EmptyKey);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);
        const openErrorMessage: string = await db.open();
        if (openErrorMessage !== null) {
            return DataStorageUtils.error(openErrorMessage);
        }

        const deleteErrorMessage: string = await db.deleteRow(key);
        if (deleteErrorMessage !== null) {
            return DataStorageUtils.error(deleteErrorMessage, db);
        } else {
            return DataStorageUtils.success({}, db);
        }
    }

    async drop(options: DropOptions): Promise<{}> {
        const table: string = options.table;
        if (!table) {
            return Promise.reject(DataStorageError.EmptyTable);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);
        const dropErrorMessage: string = await db.dropTable();
        db.close();
        if (dropErrorMessage) {
            return Promise.reject({message: dropErrorMessage});
        } else {
            return Promise.resolve({});
        }
    }

    async remove(): Promise<{}> {
        const db: SqliteDB = new SqliteDB(this.dbName, '');

        const existDatabaseErrorMessage: string = await db.existsDatabase();
        if (existDatabaseErrorMessage) {
            return Promise.reject({message: existDatabaseErrorMessage});
        }

        const removeErrorMessage: string = await db.removeDatabase();
        if (removeErrorMessage) {
            return Promise.reject({message: removeErrorMessage});
        } else {
            return Promise.resolve({});
        }
    }

    async retrieve(options: RetrieveOptions): Promise<{ value: any }> {
        const table: string = options.table;
        if (!table) {
            return Promise.reject(DataStorageError.EmptyTable);
        }

        const key: string = options.key;
        if (!key) {
            return Promise.reject(DataStorageError.EmptyKey);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);
        const openErrorMessage: string = await db.open();
        if (openErrorMessage) {
            return Promise.reject({message: openErrorMessage});
        }

        const result: { value: any } = await db.select(key);
        db.close();
        if (result === null) {
            return Promise.reject({message: DataStorageError.Select});
        } else {
            return Promise.resolve(result);
        }
    }

    async store(options: StoreOptions): Promise<{}> {
        const table: string = options.table;
        if (!table) {
            return Promise.reject(DataStorageError.EmptyTable);
        }

        const key: string = options.key;
        if (!key) {
            return Promise.reject(DataStorageError.EmptyKey);
        }

        const value: string = options.value;
        if (value === null || value === undefined) {
            return Promise.reject(DataStorageError.EmptyValue);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);
        const createTableMessage: string = await db.createTable();
        if (createTableMessage) {
            db.close();
            return Promise.reject({message: createTableMessage});
        }

        const insertErrorMessage: string = await db.insert(key, value);
        db.close();
        if (insertErrorMessage) {
            return Promise.reject({message: insertErrorMessage});
        } else {
            return Promise.resolve({});
        }
    }

}

class DataStorageNative implements DataStoragePlugin {
    private web: DataStorageWeb = new DataStorageWeb();

    database(options: DataBaseOptions): Promise<{}> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.database(options);
        } else {
            return Plugins.DataStorage.database(options);
        }
    }

    delete(options: DeleteOptions): Promise<{}> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.delete(options);
        } else {
            return Plugins.DataStorage.delete(options);
        }
    }

    drop(options: DropOptions): Promise<{}> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.drop(options);
        } else {
            return Plugins.DataStorage.drop(options);
        }
    }

    remove(): Promise<{}> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.remove();
        } else {
            return Plugins.DataStorage.remove();
        }
    }

    retrieve(options: RetrieveOptions): Promise<{ value: any }> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.retrieve(options);
        } else {
            return Plugins.DataStorage.retrieve(options);
        }
    }

    store(options: StoreOptions): Promise<{}> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.store(options);
        } else {
            return Plugins.DataStorage.store(options);
        }
    }
}

const DataStorage = new DataStorageNative();
export {DataStorage};
registerWebPlugin(new DataStorageWeb());
