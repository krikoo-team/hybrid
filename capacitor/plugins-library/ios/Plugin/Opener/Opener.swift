import Foundation
import Capacitor
import MessageUI
import MobileCoreServices

@objc(Opener)
public class Opener: CAPPlugin, UINavigationControllerDelegate {
    
    private let DEFAULT_DIRECTORY = "DOCUMENTS"
    
    private var mainCall: CAPPluginCall?
    
    @objc func open(_ call: CAPPluginCall) {
        mainCall = call
        
        let displayableName = call.getString("displayableName", "")!
        let url = call.getString("url", "")!
        let path = call.getString("path", "")!
        
        var fileUri: URL?;
        
        if path.isEmpty == true && url.isEmpty == true {
            call.error(OpenerError.EmptyFilePathAndUrl)
            return
        } else if path.isEmpty == false {
            let directory = call.getString("directory", DEFAULT_DIRECTORY)!
            fileUri = OpenerUtils.getUriByPathAndDirectory(call, path, directory, displayableName)
        } else {
            fileUri = OpenerUtils.getUriByUrl(call, url, displayableName)
        }
        
        if fileUri == nil {
            call.error(OpenerError.EmptyData)
            return
        } else {
            var activityItems = [Any]();
            activityItems.append(fileUri!)
            
            DispatchQueue.main.sync {
                let actionController = UIActivityViewController(activityItems: activityItems, applicationActivities: nil);
                
                actionController.completionWithItemsHandler = { (activityType, completed, _ returnedItems, activityError) in
                    
                    self.bridge.viewController.dismiss(animated: true, completion: nil)
                    
                    if activityError != nil {
                        call.error(OpenerError.OpeningActivityItems, activityError)
                        return
                    }
                    
                    if (completed) {
                        call.success(["status": OpenResultStatus.Opened])
                    } else {
                        call.success(["status": OpenResultStatus.Cancelled])
                    }
                }
                
                self.setCenteredPopover(actionController)
                self.bridge.viewController.present(actionController, animated: true, completion: nil)
            }
        }
    }
    
    private func handleError(_ message: String, _ error: Error? = nil) {
        if let call = mainCall {
            call.error(message, error)
        }
    }
    
    private func handleSuccess() {
        if let call = mainCall {
            call.success()
        }
    }
    
    private func handleSuccess(_ data: PluginResultData) {
        if let call = mainCall {
            call.success(data)
        }
    }
    
}
