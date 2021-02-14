import Foundation
import Capacitor

public class FilePickerUtils {
    
    public static func readFile(_ call: CAPPluginCall, path: URL) -> String? {
        do {
            let data = try FilePickerUtils.readFileAsBase64EncodedData(at: path)
            return data
        } catch let error as NSError {
            handleError(call, FilePickerError.ReadingFile, error)
            return nil
        }
    }
    
    private static func readFileAsBase64EncodedData(at fileUrl: URL) throws -> String {
        let data = try Data(contentsOf: fileUrl)
        return data.base64EncodedString()
    }
    
    private static func handleError(_ call: CAPPluginCall, _ message: String, _ error: Error? = nil) {
        call.error(message, error)
    }
    
}
