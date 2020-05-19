import Foundation
import Capacitor

@objc(DataStorage)
public class DataStorage: CAPPlugin {
    
    private var dbName = "datastorage.sqlite"
    
    @objc func database(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.error(DataStorageError.EmptyDatabaseName)
            return
        }
        self.dbName = "\(name).sqlite"
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
        
        let db = SqliteDB(dbPath: self.dbName, tableName: table)
        
        if !db.existDatabase() {
            call.error(DataStorageError.DatabaseNotFound)
            return
        }
        
        if let errorMessage = db.open() {
            DataStorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.deleteRow(key: key) {
            DataStorageUtils.error(errorMessage, db, call)
        } else {
            DataStorageUtils.success([:], db, call)
        }
    }
    
    @objc func drop(_ call: CAPPluginCall){
        guard let table = call.getString("table") else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbName, tableName: table)
        
        if !db.existDatabase() {
            call.error(DataStorageError.DatabaseNotFound)
            return
        }
        
        if let errorMessage = db.open() {
            DataStorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.dropTable() {
            DataStorageUtils.error(errorMessage, db, call)
        } else {
            DataStorageUtils.success([:], db, call)
        }
    }
    
    @objc func remove(_ call: CAPPluginCall) {
        let db = SqliteDB(dbPath: self.dbName, tableName: "")
        
        if !db.existDatabase() {
            call.error(DataStorageError.DatabaseNotFound)
            return
        }
        
        if let errorMessage = db.removeDatabase() {
            DataStorageUtils.error(errorMessage, db, call)
        } else {
            DataStorageUtils.success([:], db, call)
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
        
        let db = SqliteDB(dbPath: self.dbName, tableName: table)
        
        if !db.existDatabase() {
            call.error(DataStorageError.DatabaseNotFound)
            return
        }
        
        if let errorMessage = db.open() {
            DataStorageUtils.error(errorMessage, db, call)
            return
        }
        
        let storedValue = db.selectOne(key: key)
        print("DATA STORAGE -> result: \(storedValue)")
        if !storedValue.starts(with: "{") {
            DataStorageUtils.error(storedValue, db, call)
            return
        }
        
        guard let value = DataStorageUtils.jsonParse(storedValue) else {
            DataStorageUtils.error(DataStorageError.JsonParse, db, call)
            return
        }
        DataStorageUtils.success(value, db, call)
        
    }
    
    @objc func retrieveAll(_ call: CAPPluginCall) {
        guard let table = call.getString("table") else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbName, tableName: table)
        
        if !db.existDatabase() {
            call.error(DataStorageError.DatabaseNotFound)
            return
        }
        
        if let errorMessage = db.open() {
            DataStorageUtils.error(errorMessage, db, call)
            return
        }
        
        let storedKeyValues = db.selectAll()
        if storedKeyValues.index(forKey: DataStorageUtils.DATA_STORAGE_ERROR_HASH) != nil {
            let selectAllErrorMessage = storedKeyValues[DataStorageUtils.DATA_STORAGE_ERROR_HASH]
            DataStorageUtils.error(selectAllErrorMessage as! String, db, call)
            return
        }
    
        DataStorageUtils.success(storedKeyValues, db, call)
    }
    
    @objc func store(_ call: CAPPluginCall) {
        // TODO: Add type to avoid problems with boolean and numbers
        // TODO: Now transforms 0 to false.
        
        guard let table = DataStorageUtils.getNoEmptyString("table", call) else {
            call.error(DataStorageError.EmptyTable)
            return
        }
        
        guard let key =  DataStorageUtils.getNoEmptyString("key", call) else {
            call.error(DataStorageError.EmptyKey)
            return
        }
        
        guard let objectValue: [String:Any] = DataStorageUtils.getObjectToStore("value", call) else {
            call.error(DataStorageError.EmptyValue)
            return
        }
        
        guard let value: String = DataStorageUtils.jsonStringify(json: objectValue) else {
            call.error(DataStorageError.JsonStringify)
            return
        }
        
        let db = SqliteDB(dbPath: self.dbName, tableName: table)
        if let errorMessage = db.open() {
            DataStorageUtils.error(errorMessage, db, call)
            return
        }
        
        if let errorMessage = db.createTable() {
            DataStorageUtils.error(errorMessage, db, call)
        } else {
            if let errorMessage = db.insert(key: key, value: value) {
                DataStorageUtils.error(errorMessage, db, call)
            } else {
                DataStorageUtils.success([:], db, call)
            }
        }
    }
    
}
