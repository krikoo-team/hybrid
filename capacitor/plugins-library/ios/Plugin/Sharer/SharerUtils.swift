import Foundation
import Capacitor
import MessageUI
import MobileCoreServices

public class SharerUtils {
    
    private static let DEFAULT_DIRECTORY = "DOCUMENTS"
    
    public static func ableToOpenMail(_ options: ShareEmailOptions?, _ urls: [URL]) -> Bool {
        return options != nil &&
            (options!.app == ShareEmailApp.Default || options!.app == ShareEmailApp.Mail) &&
            (options!.hasParams || !urls.isEmpty)
    }
    
    public static func ableToOpenEspecifiedApp(_ options: ShareEmailOptions?, _ urls: [URL]) -> Bool {
        return options != nil && urls.isEmpty && options!.hasParams
    }
    
    public static func convertEmailsToPath(emails: [String], param: String) -> String {
        if(emails.isEmpty){
            return ""
        }else if (emails.count == 1){
            return "\(param)=\(emails[0])&"
        }else{
            var path = "\(param)="
            for email in emails {
                path.append("\(email);")
            }
            path.append("&")
            return path
        }
    }
    
    public static func getActivityItems(_ call: CAPPluginCall, _ fileURLs: [URL]) -> [Any]? {
        var activityItems = [Any]();
        if let text = call.options["text"] as? String {
            activityItems.append(text)
        }
        
        if let url = call.options["url"] as? String {
            let urlObj = URL(string: url)
            activityItems.append(urlObj!)
        }
        
        for fileURL in fileURLs {
            activityItems.append(fileURL)
        }
        
        return activityItems.count == 0 ? nil : activityItems
    }
    
    public static func getEmailAliasURL(_ call: CAPPluginCall, _ shareEmailOptions: ShareEmailOptions) -> URL? {
        let alias = getAlias(app: shareEmailOptions.app)
        let bcc: String = convertEmailsToPath(emails: shareEmailOptions.bcc, param: "bcc")
        let body: String = convertTextToPath(value: shareEmailOptions.body, param: "body")
        let cc: String = convertEmailsToPath(emails: shareEmailOptions.cc, param: "cc")
        let subject: String = convertTextToPath(value: shareEmailOptions.subject, param: "subject")
        let to: String = convertEmailsToPath(emails: shareEmailOptions.to, param: "to")
        let paramsPath = "\(to)\(cc)\(bcc)\(body)\(subject)"
        let path = "\(alias)?\(paramsPath)"
        
        guard let url = URL(string: path) else {
            handleError(call, SharerError.UrlParamsConversion)
            return nil
        }
        
        return url
    }
    
    public static func getFileURLs(_ call: CAPPluginCall) -> [URL]? {
        var fileUrls: [URL] = []
        if let files = call.getArray("files", [String:Any].self) {
            if !clearTempDirectory(call) {
                return nil
            }
            for file in files {
                let directoryOption = file["directory"] as? String ?? DEFAULT_DIRECTORY
                
                guard let path = file["path"] as? String else {
                    handleError(call, SharerError.EmptyFilePath)
                    return nil
                }
                
                guard let fileUrl = getFileUrl(path, directoryOption) else {
                    handleError(call, SharerError.InvalidPath)
                    return nil
                }
                
                if let displayableFileName = file["displayableName"] as? String {
                    let temporaryDirectory = FileManager.default.temporaryDirectory.appendingPathComponent(displayableFileName)
                    
                    do {
                        try FileManager.default.copyItem(at: fileUrl, to: temporaryDirectory);
                    } catch let error as NSError {
                        handleError(call, SharerError.CopyFileToTemp, error)
                        return nil
                    }
                    
                    if FileManager.default.fileExists(atPath: temporaryDirectory.path) {
                        fileUrls.append(temporaryDirectory)
                    }
                } else {
                    if FileManager.default.fileExists(atPath: fileUrl.path) {
                        fileUrls.append(fileUrl)
                    }
                }
            }
        }
        return fileUrls
    }
    
    public static func getMailComposeViewController(_ call: CAPPluginCall, _ shareEmailOptions: ShareEmailOptions, _ fileURLs: [URL]) -> MFMailComposeViewController? {
        let mail = MFMailComposeViewController()
        mail.setToRecipients(shareEmailOptions.to)
        mail.setSubject(shareEmailOptions.subject)
        mail.setCcRecipients(shareEmailOptions.cc)
        mail.setBccRecipients(shareEmailOptions.bcc)
        mail.setMessageBody(shareEmailOptions.body, isHTML: shareEmailOptions.isHTML)
        
        for fileURL in fileURLs {
            do {
                let data = try Data(contentsOf: fileURL)
                let fileExtension = fileURL.pathExtension
                let fileName = fileURL.lastPathComponent
                let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension ,fileExtension as CFString, nil)
                
                guard let mimeType: String = uti?.takeRetainedValue() as String? else {
                    handleError(call, SharerError.MimeType)
                    print("Error getting file mime type from path: " + fileURL.absoluteString)
                    return nil
                }
                
                mail.addAttachmentData(data, mimeType: mimeType, fileName: fileName)
            } catch {
                handleError(call, SharerError.UrlToData, error)
                return nil
            }
        }
        
        return mail
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
            handleError(call, SharerError.ClearTempDir, error)
            return false
        }
    }
    
    private static func convertTextToPath(value: String, param: String) -> String {
        return value.isEmpty ? "" : "\(param)=\(value)&".addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) ?? ""
    }
    
    private static func getAlias(app: String) -> String {
        switch app {
        case ShareEmailApp.Gmail:
            return "googlegmail:///co"
        case ShareEmailApp.Outlook:
            return "ms-outlook://compose"
        case ShareEmailApp.Yahoo:
            return "ymail://mail/compose"
        default:
            return app
        }
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
        if path.starts(with: "file://") {
            return URL(string: path)
        }
        
        let directory = getDirectory(directory: directoryOption)
        
        guard let dir = FileManager.default.urls(for: directory, in: .userDomainMask).first else {
            return nil
        }
        
        return dir.appendingPathComponent(path)
    }
    
    private static func handleError(_ call: CAPPluginCall, _ message: String, _ error: Error? = nil) {
        call.error(message, error)
    }
    
}
