package com.krikoo.capacitor;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class DataStorage extends Plugin {

  private String dbPath = "datastorage.sqlite";

  @PluginMethod()
  public void database(PluginCall call) {
    String name = call.getString("name");
    if (name == null) {
      call.error("DataStorageError.EmptyDatabaseName");
      return;
    }
    this.dbPath = String.format("%s.sqlite", name);
    call.success(new JSObject());
  }

}
