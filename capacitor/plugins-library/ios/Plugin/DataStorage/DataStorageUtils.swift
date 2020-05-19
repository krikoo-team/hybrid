import Foundation
import Capacitor

class DataStorageUtils {
    
    public static let DATA_STORAGE_ERROR_HASH = "KRIKOO_ERROR_HASH"
    
    public static func error(_ message: String, _ db: SqliteDB, _ call: CAPPluginCall) {
        db.close()
        call.reject(message)
    }
    
    public static func getNoEmptyString(_ key: String, _ call: CAPPluginCall) -> String? {
        guard let value = call.getString(key) else {
            return nil
        }
        return value.isEmpty ? nil : value
    }
    
    public static func getObjectToStore(_ key: String, _ call: CAPPluginCall) -> [String:Any]? {
        // TODO: Add type to avoid problems with boolean and numbers
        // TODO: Now transforms 0 to false.
        
        if let value = call.getBool(key, nil) {
            return ["value": value]
        }
        
        if let value = call.getDouble(key, nil) {
            return ["value": value]
        }
        
        if let value = call.getString(key, nil) {
            return ["value": value]
        }
        
        if let value = call.getArray(key, Any.self, nil) {
            return ["value": value]
        }
        
        if let value = call.getObject(key, defaultValue: nil) {
            return ["value": value]
        }
        
        return nil
    }
    
    public static func jsonStringify(json: [String:Any], prettyPrinted: Bool = false) -> String? {
        var options: JSONSerialization.WritingOptions = []
        if prettyPrinted {
            options = JSONSerialization.WritingOptions.prettyPrinted
        }
        
        do {
            let data = try JSONSerialization.data(withJSONObject: json, options: options)
            if let string = String(data: data, encoding: String.Encoding.utf8) {
                return string
            }
        } catch {
            print("DATA STORAGE -> Stringify Error: \(error)")
            return nil
        }
        return nil
    }
    
    public static func jsonParse(_ text: String) -> [String:Any]? {
        let data = text.data(using: .utf8)!
        do {
            if let jsonArray = try JSONSerialization.jsonObject(with: data, options : .allowFragments) as? [String:Any] {
                return jsonArray
            } else {
                print("DATA STORAGE -> Bad JSON: \(text)")
                return nil
            }
        } catch {
            print("DATA STORAGE -> JSON Error: \(error)")
            return nil
        }
    }
    
    public static func success(_ result: [String:Any], _ db: SqliteDB, _ call: CAPPluginCall) {
        db.close()
        call.success(result)
    }
    
}
