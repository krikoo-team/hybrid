package com.krikoo.capacitor;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public class DataStorageUtils {

  public static void error(String message, SqliteDB db, PluginCall call) {
    db.close();
    call.reject(message);
  }

  public static String getNoEmptyString(String key, PluginCall call) {
    String table = call.getString(key);
    return table == null || table.isEmpty() ? null : table;
  }

  public static JSObject getObjectToStore(String key, PluginCall call) {
    JSObject value = new JSObject();

    String textValue = call.getString(key, null);
    if (textValue != null) {
      value.put("value", textValue);
    }

    Integer intValue = call.getInt(key, null);
    if (intValue != null) {
      value.put("value", intValue);
    }

    JSArray arrayValue = call.getArray(key, null);
    if (arrayValue != null) {
      value.put("value", arrayValue);
    }

    JSObject objectValue = call.getObject(key, null);
    if (objectValue != null) {
      value.put("value", objectValue);
    }

    return value.length() == 0 ? null : value;
  }

  public static void success(JSObject result, SqliteDB db, PluginCall call) {
    db.close();
    call.success(result);
  }

}
