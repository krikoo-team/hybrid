import Foundation
import Capacitor
import MessageUI
import MobileCoreServices

public class OpenerUtils {
    
    public static func getUriByPathAndDirectory(_ call: CAPPluginCall, _ path: String, _ directory: String, _ displayableName: String) -> URL? {
        guard let fileUrl = getFileUrl(path, directory) else {
            handleError(call, OpenerError.InvalidPath)
            return nil
        }
        return OpenerUtils.getTemporaryFileUrl(call, fileUrl, displayableName)
    }
    
    public static func getUriByUrl(_ call: CAPPluginCall, _ url: String, _ displayableName: String) -> URL? {
        guard let fileUrl = URL(string: url) else {
            handleError(call, OpenerError.InvalidPath)
            return nil
        }
        return OpenerUtils.getTemporaryFileUrl(call, fileUrl, displayableName)
    }
    
    private static func clearTempDirectory(_ call: CAPPluginCall) -> Bool {
        let fileManager = FileManager.default
        let tempDirectoryPath = fileManager.temporaryDirectory.path
        do {
            let filePaths = try fileManager.contentsOfDirectory(atPath: tempDirectoryPath)
            for filePath in filePaths {
                try fileManager.removeItem(atPath: tempDirectoryPath + "/" + filePath)
            }
            return true
        } catch {
            handleError(call, OpenerError.ClearTempDir, error)
            return false
        }
    }
    
    private static func convertTextToPath(value: String, param: String) -> String {
        return value.isEmpty ? "" : "\(param)=\(value)&".addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) ?? ""
    }
    
    private static func getDirectory(directory: String) -> FileManager.SearchPathDirectory {
        switch directory {
        case "DOCUMENTS":
            return .documentDirectory
        case "CACHE":
            return .cachesDirectory
        default:
            return .documentDirectory
        }
    }
    
    private static func getFileUrl(_ path: String, _ directoryOption: String) -> URL? {
        let directory = getDirectory(directory: directoryOption)
        
        guard let dir = FileManager.default.urls(for: directory, in: .userDomainMask).first else {
            return nil
        }
        
        return dir.appendingPathComponent(path)
    }
    
    private static func getTemporaryFileUrl(_ call: CAPPluginCall, _ uri: URL, _ displayableName: String) -> URL? {
        if(displayableName.isEmpty) {
            if FileManager.default.fileExists(atPath: uri.path) {
                return uri
            } else {
                return nil
            }
        } else {
            if !clearTempDirectory(call) {
                return nil
            }
            
            let temporaryFileUrl = FileManager.default.temporaryDirectory.appendingPathComponent(displayableName)

            do {
                try FileManager.default.copyItem(at: uri, to: temporaryFileUrl);
            } catch let error as NSError {
                handleError(call, OpenerError.CopyFileToTemp, error)
                return nil
            }
            
            if FileManager.default.fileExists(atPath: temporaryFileUrl.path) {
                return temporaryFileUrl
            } else {
                return nil
            }
        }
    }
    
    private static func handleError(_ call: CAPPluginCall, _ message: String, _ error: Error? = nil) {
        call.error(message, error)
    }
    
}
