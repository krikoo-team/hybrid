public class ShareEmailOptions {
    
    var app: String = "DEFAULT"
    var bcc: [String] = []
    var body: String = ""
    var cc: [String] = []
    var hasParams = false
    var isHTML: Bool = false
    var subject: String = ""
    var to: [String] = []
    
    init(_ shareOptionEmailObject: [String:Any] = [:]){
        app = shareOptionEmailObject["app"] as? String ?? app
        app = app.isEmpty ? "DEFAULT" : app
        bcc = shareOptionEmailObject["bcc"] as? [String] ?? bcc
        body = shareOptionEmailObject["body"] as? String ?? body
        cc = shareOptionEmailObject["cc"] as? [String] ?? cc
        isHTML = shareOptionEmailObject["isHTML"] as? Bool ?? isHTML
        subject = shareOptionEmailObject["subject"] as? String ?? subject
        to = shareOptionEmailObject["to"] as? [String] ?? to
        hasParams = !(bcc.isEmpty && body.isEmpty && cc.isEmpty && subject.isEmpty && to.isEmpty)
    }
    
}
