#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(FilePicker, "FilePicker",
           CAP_PLUGIN_METHOD(present, CAPPluginReturnPromise);
)

CAP_PLUGIN(DataStorage, "DataStorage",
           CAP_PLUGIN_METHOD(database, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(delete, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(drop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(remove, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(retrieve, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(retrieveAll, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(store, CAPPluginReturnPromise);
)

CAP_PLUGIN(Opener, "Opener",
           CAP_PLUGIN_METHOD(open, CAPPluginReturnPromise);
)

CAP_PLUGIN(Sharer, "Sharer",
           CAP_PLUGIN_METHOD(share, CAPPluginReturnPromise);
)
