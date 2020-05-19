#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(Sharer, "Sharer",
           CAP_PLUGIN_METHOD(share, CAPPluginReturnPromise);
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
