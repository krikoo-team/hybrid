import Foundation
import Capacitor
import MessageUI
import MobileCoreServices

@objc(Sharer)
public class Sharer: CAPPlugin, MFMailComposeViewControllerDelegate, UINavigationControllerDelegate {
    
    private var mainCall: CAPPluginCall?
    
    @objc func share(_ call: CAPPluginCall) {
        mainCall = call
        
        guard let fileUris = SharerUtils.getFileURLs(call) else {
            return
        }
        
        let email: [String:Any]? = call.getObject("email")
        var shareEmailOptions: ShareEmailOptions? = nil
        
        if email != nil {
            shareEmailOptions = ShareEmailOptions(email!)
        }
        
        if SharerUtils.ableToOpenMail(shareEmailOptions, fileUris) {
            DispatchQueue.main.async {
                guard let mail = SharerUtils.getMailComposeViewController(call, shareEmailOptions!, fileUris) else {
                    call.error(SharerError.MailComposer)
                    return
                }
                mail.mailComposeDelegate = self
                self.bridge.viewController.present(mail, animated: true, completion: nil)
            }
        } else if SharerUtils.ableToOpenEspecifiedApp(shareEmailOptions, fileUris) {
            guard let emailAliasURL = SharerUtils.getEmailAliasURL(call, shareEmailOptions!) else {
                return
            }
            
            DispatchQueue.main.async {
                func completionHandler(completion: Bool) {
                    if completion {
                        call.success(["status": ShareResultStatus.Opened])
                    } else {
                        call.error(SharerError.OpenExternalApp)
                    }
                }
                
                UIApplication.shared.open(emailAliasURL, options: [:], completionHandler: completionHandler)
            }
        } else {
            guard let activityItems = SharerUtils.getActivityItems(call, fileUris) else {
                call.error(SharerError.EmptyData)
                return
            }
            
            DispatchQueue.main.sync {
                let actionController = UIActivityViewController(activityItems: activityItems, applicationActivities: nil);
                
                actionController.completionWithItemsHandler = { (activityType, completed, _ returnedItems, activityError) in
                    
                    self.bridge.viewController.dismiss(animated: true, completion: nil)
                    
                    if activityError != nil {
                        call.error(SharerError.SharingActivityItems, activityError)
                        return
                    }
                    
                    if (completed) {
                        call.success(["status": ShareResultStatus.Shared])
                    } else {
                        call.success(["status": ShareResultStatus.Cancelled])
                    }
                }
                
                self.setCenteredPopover(actionController)
                self.bridge.viewController.present(actionController, animated: true, completion: nil)
            }
        }
    }
    
    public func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith mailComposerResult: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
        var result: String = "";
        
        switch mailComposerResult {
        case .cancelled:
            result = ShareResultStatus.Cancelled
            break
        case .saved:
            result = ShareResultStatus.Saved
            break
        case .sent:
            result = ShareResultStatus.Sent
            break
        case .failed:
            result = SharerError.DoAction
        @unknown default:
            result = ShareResultStatus.Undefinded
        }
        
        if let mailError = error {
            handleError(result, mailError)
        }else{
            handleSuccess(["status": result])
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
