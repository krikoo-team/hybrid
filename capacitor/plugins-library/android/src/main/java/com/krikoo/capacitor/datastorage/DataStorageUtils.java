package com.krikoo.capacitor.datastorage;

import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import com.krikoo.capacitor.datastorage.models.SqliteDB;

public class DataStorageUtils {

  public static String DATA_STORAGE_ERROR_HASH = "KRIKOO_ERROR_HASH";

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

    Boolean booleanValue = call.getBoolean(key, null);
    if (booleanValue != null) {
      value.put("value", booleanValue);
    }

    Integer intValue = call.getInt(key, null);
    if (intValue != null) {
      value.put("value", intValue);
    }

    String textValue = call.getString(key, null);
    if (textValue != null) {
      value.put("value", textValue);
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

  public static JSObject jsonParse(String text) {
    try {
      return new JSObject(text);
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("Bad JSON: %s", text));
      return null;
    }
  }

  public static void success(JSObject result, SqliteDB db, PluginCall call) {
    db.close();
    call.success(result);
  }

}
