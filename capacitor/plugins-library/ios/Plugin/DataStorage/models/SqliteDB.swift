import Foundation
import Capacitor
import SQLite3

class SqliteDB {
    
    private var db: OpaquePointer? = nil
    private var dbPath: String
    private var tableName: String
    
    init(dbPath: String, tableName: String) {
        self.dbPath = dbPath
        self.tableName = tableName
    }
    
    public func close(){
        if sqlite3_close(db) != SQLITE_OK{
            print("DATA STORAGE -> \(dbPath): Error closed database.")
        }else{
            print("DATA STORAGE -> \(dbPath): Successfully closed connection to database.")
        }
    }
    
    public func createTable() -> String? {
        let createTableString = "CREATE TABLE IF NOT EXISTS \(tableName)(key TEXT PRIMARY KEY,value TEXT);"
        var errorMessage: String? = nil
        var createTableStatement: OpaquePointer? = nil
        if sqlite3_prepare_v2(db, createTableString, -1, &createTableStatement, nil) == SQLITE_OK{
            if sqlite3_step(createTableStatement) == SQLITE_DONE{
                print("DATA STORAGE -> \(dbPath)/\(tableName): Successfully created table.")
            } else {
                print("DATA STORAGE -> \(dbPath)/\(tableName): Table could not be created.")
                errorMessage = DataStorageError.CreateTable
            }
        } else {
            print("DATA STORAGE -> \(dbPath)/\(tableName): CREATE TABLE statement could not be prepared.")
            errorMessage = DataStorageError.CreateTableStatement
        }
        sqlite3_finalize(createTableStatement)
        return errorMessage
    }
    
    public func deleteRow(key: String) -> String? {
        let deleteQuery = "DELETE FROM \(tableName) WHERE key = ?;"
        var errorMessage: String? = nil
        var deleteStatement: OpaquePointer? = nil
        if sqlite3_prepare_v2(db, deleteQuery, -1, &deleteStatement, nil) == SQLITE_OK {
            sqlite3_bind_text(deleteStatement, 1, (key as NSString).utf8String, -1, nil)
            if sqlite3_step(deleteStatement) == SQLITE_DONE {
                print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): Successfully deleted row.")
            } else {
                print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): Could not delete row.")
                errorMessage = DataStorageError.Delete
            }
        } else {
            let prepareErrorMessage = String(cString: sqlite3_errmsg(db)!)
            if prepareErrorMessage.contains("no such table") {
                errorMessage = DataStorageError.TableNotFound
            }else{
                errorMessage = DataStorageError.DeleteStatement
            }
            print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): DELETE statement could not be prepared. \(prepareErrorMessage)")
        }
        sqlite3_finalize(deleteStatement)
        return errorMessage
    }
    
    public func dropTable() -> String? {
        let dropTableString = "DROP TABLE \(tableName);"
        var errorMessage: String? = nil
        var dropTableStatement: OpaquePointer? = nil
        let prepare = sqlite3_prepare_v2(db, dropTableString, -1, &dropTableStatement, nil)
        if prepare == SQLITE_OK{
            if sqlite3_step(dropTableStatement) == SQLITE_DONE{
                print("DATA STORAGE -> \(dbPath)/\(tableName): table dropped.")
            } else {
                let stepErrorMessage = String(cString: sqlite3_errmsg(db)!)
                print("DATA STORAGE -> \(dbPath)/\(tableName): table could not be dropped. \(stepErrorMessage)")
                errorMessage = DataStorageError.DropTable
            }
        } else {
            let prepareErrorMessage = String(cString: sqlite3_errmsg(db)!)
            if prepareErrorMessage.contains("no such table") {
                errorMessage = DataStorageError.TableNotFound
            }else{
                errorMessage = DataStorageError.DropTableStatement
            }
            print("DATA STORAGE -> \(dbPath)/\(tableName): DROP TABLE statement could not be prepared. \(prepareErrorMessage)")
        }
        sqlite3_finalize(dropTableStatement)
        return errorMessage
    }
    
    public func existDatabase() -> Bool {
        let fileURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
        .appendingPathComponent(dbPath)
        let exists = FileManager.default.fileExists(atPath: fileURL.path)
        if(exists == true){
            print("DATA STORAGE -> \(dbPath): Database exists.")
        }else{
            print("DATA STORAGE -> \(dbPath): Database does not exist.")
        }
        return exists
    }
    
    public func insert(key:String, value:String) -> String? {
        let insertStatementString = "INSERT OR REPLACE INTO \(tableName) (key, value) VALUES (?, ?);"
        var errorMessage: String? = nil
        var insertStatement: OpaquePointer? = nil
        if sqlite3_prepare_v2(db, insertStatementString, -1, &insertStatement, nil) == SQLITE_OK {
            sqlite3_bind_text(insertStatement, 1, (key as NSString).utf8String, -1, nil)
            sqlite3_bind_text(insertStatement, 2, (value as NSString).utf8String, -1, nil)
            
            if sqlite3_step(insertStatement) == SQLITE_DONE {
                print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): Successfully inserted or replaced row.")
            } else {
                let errmsg = String(cString: sqlite3_errmsg(db)!)
                print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): Error preparing insert: \(errmsg)")
                errorMessage = DataStorageError.InsertOrReplace
            }
        } else {
            print("DATA STORAGE -> \(dbPath)/\(tableName)/\(key): INSERT OR REPLACE statement could not be prepared.")
            errorMessage = DataStorageError.InsertOrReplaceStatement
        }
        sqlite3_finalize(insertStatement)
        return errorMessage;
    }
    
    public func open() -> String? {
        let fileURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            .appendingPathComponent(dbPath)
        if sqlite3_open(fileURL.path, &db) != SQLITE_OK{
            print("DATA STORAGE -> \(dbPath): Error opening database.")
            return DataStorageError.OpenDatabase
        }else{
            print("DATA STORAGE -> \(dbPath): Successfully opened connection to database.")
            return nil
        }
    }
    
    public func removeDatabase() -> String? {
        let fileURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            .appendingPathComponent(dbPath)
        do {
            try FileManager.default.removeItem(at: fileURL as URL)
            print("DATA STORAGE -> \(dbPath): Successfully deleted database.")
            return nil
        } catch {
            print("DATA STORAGE -> \(dbPath): Error deleting database.")
            return DataStorageError.RemoveDatabase
        }
    }
    
    public func selectAll() -> [String:Any] {
        let retrieveResults = select(key: nil)
        var keyValues: [String:Any] = [:]
        for retrieveResult in retrieveResults {
            let key = retrieveResult.key
            let value = retrieveResult.value
            
            if key == DataStorageUtils.DATA_STORAGE_ERROR_HASH {
                keyValues[key] = value
            } else {
                if let dictionaryValue = DataStorageUtils.jsonParse(value) {
                    keyValues[key] = dictionaryValue
                } else {
                    return [DataStorageUtils.DATA_STORAGE_ERROR_HASH : DataStorageError.JsonParse]
                }
            }
        }
        return keyValues;
    }
    
    public func selectOne(key: String?) -> String {
        let results = select(key: key)
        if results.count == 0 {
            return DataStorageError.KeyNotFound
        }else{
            return results[0].value
        }
    }
    
    private func select(key: String?) -> [RetrieveResult] {
        let whereStatementString = key != nil && !key!.isEmpty ? "WHERE key = '\(key!)'" : ""
        let selectStatementString: String = "SELECT * FROM \(tableName) \(whereStatementString);"
        var selectStatement: OpaquePointer? = nil
        var results : [RetrieveResult] = []
        if sqlite3_prepare_v2(db, selectStatementString, -1, &selectStatement, nil) == SQLITE_OK {
            while sqlite3_step(selectStatement) == SQLITE_ROW {
                let key = String(describing: String(cString: sqlite3_column_text(selectStatement, 0)))
                let value = String(describing: String(cString: sqlite3_column_text(selectStatement, 1)))
                results.append(RetrieveResult(key: key, value: value))
                print("DATA STORAGE -> \(dbPath)/\(tableName): query result: \(key) |  \(value)")
            }
        } else {
            let prepareErrorMessage = String(cString: sqlite3_errmsg(db)!)
            
            print("DATA STORAGE -> \(dbPath)/\(tableName): \(selectStatementString) statement could not be prepared. \(prepareErrorMessage)")
            let selectError: String = prepareErrorMessage.contains("no such table") ? DataStorageError.TableNotFound : DataStorageError.Select
            results.append(RetrieveResult(key: DataStorageUtils.DATA_STORAGE_ERROR_HASH, value: selectError))
        }
        sqlite3_finalize(selectStatement)
        return results
    }
    
}
