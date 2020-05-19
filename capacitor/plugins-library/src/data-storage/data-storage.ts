import {Capacitor, Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {DataStoragePlugin} from '../definitions';

import {DataBaseOptions} from './models/DataBaseOptions';
import {DataStorageError} from './models/DataStorageError';
import {DataStorageUtils} from './data-storage.utils';
import {DeleteOptions} from './models/DeleteOptions';
import {DropOptions} from './models/DropOptions';
import {RetrieveOptions} from './models/RetrieveOptions';
import {KrikooUtils} from '../models/KrikooUtils';
import {RetrieveAllOptions} from './models/RetrieveAllOptions';
import {SqliteDB} from './models/SqliteDB';
import {StoreOptions} from './models/StoreOptions';

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

        const existDatabaseError: string = await db.existsDatabase();
        if (existDatabaseError !== null) {
            return DataStorageUtils.error(existDatabaseError);
        }

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
            return DataStorageUtils.error(DataStorageError.EmptyTable);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);

        const existDatabaseError: string = await db.existsDatabase();
        if (existDatabaseError !== null) {
            return DataStorageUtils.error(existDatabaseError);
        }

        const dropErrorMessage: string = await db.dropTable();
        if (dropErrorMessage) {
            return DataStorageUtils.error(dropErrorMessage);
        } else {
            return DataStorageUtils.success({}, db);
        }
    }

    async remove(): Promise<{}> {
        const db: SqliteDB = new SqliteDB(this.dbName, '');

        const existDatabaseErrorMessage: string = await db.existsDatabase();
        if (existDatabaseErrorMessage) {
            return DataStorageUtils.error(existDatabaseErrorMessage);
        }

        const removeErrorMessage: string = await db.removeDatabase();
        if (removeErrorMessage) {
            return DataStorageUtils.error(removeErrorMessage, db);
        } else {
            return DataStorageUtils.success({});
        }
    }

    async retrieve(options: RetrieveOptions): Promise<{ value: any }> {
        const table: string = options.table;
        if (!table) {
            return DataStorageUtils.error(DataStorageError.EmptyTable);
        }

        const key: string = options.key;
        if (!key) {
            return DataStorageUtils.error(DataStorageError.EmptyKey);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);

        const existDatabaseError: string = await db.existsDatabase();
        if (existDatabaseError !== null) {
            return DataStorageUtils.error(existDatabaseError);
        }

        const openErrorMessage: string = await db.open();
        if (openErrorMessage) {
            return DataStorageUtils.error(openErrorMessage);
        }

        const result: { value: any } | string = await db.selectOne(key);
        if (typeof result === "string") {
            return DataStorageUtils.error(result, db);
        } else {
            return DataStorageUtils.success(result, db);
        }
    }

    async retrieveAll(options: RetrieveAllOptions): Promise<{ [key: string]: any }> {
        const table: string = options.table;
        if (!table) {
            return DataStorageUtils.error(DataStorageError.EmptyTable);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);

        const existDatabaseError: string = await db.existsDatabase();
        if (existDatabaseError !== null) {
            return DataStorageUtils.error(existDatabaseError);
        }

        const openErrorMessage: string = await db.open();
        if (openErrorMessage) {
            return DataStorageUtils.error(openErrorMessage);
        }

        const result: { [key: string]: any } | string = await db.selectAll();
        if (typeof result === "string") {
            return DataStorageUtils.error(result, db);
        } else {
            return DataStorageUtils.success(result, db);
        }
    }

    async store(options: StoreOptions): Promise<{}> {
        const table: string = options.table;
        if (!table) {
            return DataStorageUtils.error(DataStorageError.EmptyTable);
        }

        const key: string = options.key;
        if (!key) {
            return DataStorageUtils.error(DataStorageError.EmptyKey);
        }

        const value: string = options.value;
        if (value === null || value === undefined) {
            return DataStorageUtils.error(DataStorageError.EmptyValue);
        }

        const db: SqliteDB = new SqliteDB(this.dbName, table);

        const createTableMessage: string = await db.createTable();
        if (createTableMessage) {
            return DataStorageUtils.error(createTableMessage, db);
        }

        const insertErrorMessage: string = await db.insert(key, value);
        if (insertErrorMessage) {
            return DataStorageUtils.error(insertErrorMessage, db);
        } else {
            return DataStorageUtils.success({}, db);
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

    retrieveAll(options: RetrieveAllOptions): Promise<{ [key: string]: any }> {
        if (Capacitor.getPlatform() === 'web') {
            return this.web.retrieveAll(options);
        } else {
            return Plugins.DataStorage.retrieveAll(options);
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
