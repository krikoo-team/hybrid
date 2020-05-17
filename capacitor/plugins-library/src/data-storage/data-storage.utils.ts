import {SqliteDB} from './models/SqliteDB';

export class DataStorageUtils {

    public static error(message: string, db?: SqliteDB): Promise<any> {
        if (db) {
            db.close();
        }
        return Promise.reject(message);
    }

    public static success(result: any, db?: SqliteDB): Promise<any> {
        if (db) {
            db.close();
        }
        return Promise.resolve(result);
    }

}
