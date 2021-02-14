import Foundation
import Capacitor
import MobileCoreServices

typealias JSObject = [String:Any]
@objc(FilePicker)
public class FilePicker: CAPPlugin {
    
    @objc func present(_ call: CAPPluginCall) {
        let defaults = UserDefaults()
        defaults.set(call.callbackId, forKey: "callbackId")
        
        call.save()
        
        DispatchQueue.main.async {
            let documentPicker = UIDocumentPickerViewController(documentTypes: [String(kUTTypeItem)], in: .import)
            documentPicker.delegate = self
            documentPicker.allowsMultipleSelection = false
            self.bridge.viewController.present(documentPicker, animated: true, completion: nil)
        }
    }
    
}

extension FilePicker: UIDocumentPickerDelegate {
    
    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        let defaults = UserDefaults()
        let id = defaults.string(forKey: "callbackId") ?? ""
        
        guard let call = self.bridge.getSavedCall(id) else {
            return
        }
        
        let pathExtension = urls[0].pathExtension
        let name = urls[0].lastPathComponent
        let uri = urls[0].absoluteString
        let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension ,pathExtension as CFString, nil)
        
        guard let mimeType: String = uti?.takeRetainedValue() as String? else {
            call.error(FilePickerError.MimeType)
            print("Error getting file mime type from path: " + uri)
            return
        }

        guard let data = FilePickerUtils.readFile(call, path: urls[0]) else {
            return
        }
        
        var filePickerResult = JSObject()
        filePickerResult["data"] = data
        filePickerResult["uri"] = uri
        filePickerResult["name"] = name
        filePickerResult["mimeType"] = mimeType
        filePickerResult["extension"] = pathExtension
        call.resolve(filePickerResult)
    }
    
}
