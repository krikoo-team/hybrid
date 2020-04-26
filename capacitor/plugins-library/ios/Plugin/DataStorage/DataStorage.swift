import Foundation
import Capacitor

@objc(DataStorage)
public class DataStorage: CAPPlugin {
    
    private var dbPath = "datastorage.sqlite"
    
    @objc func database(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.error(DataStorageError.EmptyDatabaseName)
            return
        }
        self.dbPath = "\(name).sqlite"
        call.success([:])
    }
    
    @objc func delete(_ call: CAPPluginCall) {
        guard let table = call.getString("table") else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        guard let key = call.getString("key") else {
            call.error(DataStorageError.EmptyKey)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbPath, tableName: table)
        if let errorMessage = db.open() {
            StorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.deleteRow(key: key) {
            StorageUtils.error(errorMessage, db, call)
        } else {
            StorageUtils.success([:], db, call)
        }
    }
    
    @objc func drop(_ call: CAPPluginCall){
        guard let table = call.getString("table") else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbPath, tableName: table)
        if let errorMessage = db.open() {
            StorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.dropTable() {
            StorageUtils.error(errorMessage, db, call)
        } else {
            StorageUtils.success([:], db, call)
        }
    }
    
    @objc func remove(_ call: CAPPluginCall) {
        let db = SqliteDB(dbPath: self.dbPath, tableName: "")
        if let errorMessage = db.removeDatabase() {
            StorageUtils.error(errorMessage, db, call)
        } else {
            StorageUtils.success([:], db, call)
        }
    }
    
    @objc func retrieve(_ call: CAPPluginCall) {
        guard let table = call.getString("table") else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        guard let key = call.getString("key") else {
            call.error(DataStorageError.EmptyKey)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbPath, tableName: table)
        if let errorMessage = db.open() {
            StorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let storedValue = db.selectOne(key: key) {
            print("DATA STORAGE -> result: \(storedValue)")
            guard let value = StorageUtils.jsonParse(storedValue) else {
                StorageUtils.error(DataStorageError.JsonParse, db, call)
                return
            }
            StorageUtils.success(value, db, call)
        }else{
            StorageUtils.error(DataStorageError.SelectStatement, db, call)
        }
    }
    
    @objc func store(_ call: CAPPluginCall) {
        guard let table = StorageUtils.getNoEmptyString("table", call) else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        guard let key =  StorageUtils.getNoEmptyString("key", call) else {
            call.error(DataStorageError.EmptyKey)
            return
        }
        
        guard let objectValue: [String:Any] = StorageUtils.getObjectToStore("value", call) else {
            call.error(DataStorageError.EmptyValue)
            return
        }
        
        guard let value: String = StorageUtils.jsonStringify(json: objectValue) else {
            call.error(DataStorageError.JsonStringify)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbPath, tableName: table)
        if let errorMessage = db.open() {
            StorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.createTable() {
            StorageUtils.error(errorMessage, db, call)
        } else {
            if let errorMessage = db.insert(key: key, value: value) {
                StorageUtils.error(errorMessage, db, call)
            } else {
                StorageUtils.success([:], db, call)
            }
        }
    }
    
}
