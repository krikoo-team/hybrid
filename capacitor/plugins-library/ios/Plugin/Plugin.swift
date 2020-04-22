import Foundation
import Capacitor

@objc(PluginsLibrary)
public class PluginsLibrary: CAPPlugin {
    
    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.success([
            "value": value
        ])
    }
    
}
