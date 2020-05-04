package com.krikoo.capacitor;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class DataStorage extends Plugin {

  private String dbName = "datastorage.sqlite";

  @PluginMethod()
  public void database(PluginCall call) {
    String name = call.getString("name");
    if (name == null) {
      call.error(DataStorageError.EmptyDatabaseName);
      return;
    }
    this.dbName = String.format("%s.sqlite", name);
    call.success(new JSObject());
  }

  @PluginMethod()
  public void delete(PluginCall call) {
    String table = DataStorageUtils.getNoEmptyString("table", call);
    if (table == null) {
      call.error(DataStorageError.EmptyTable);
      return;
    }

    String key = DataStorageUtils.getNoEmptyString("key", call);
    if (key == null) {
      call.error(DataStorageError.EmptyKey);
      return;
    }

    SqliteDB db = new SqliteDB(this.dbName, table);
    String errorMessage = db.open(bridge);
    if (errorMessage != null) {
      DataStorageUtils.error(errorMessage, db, call);
      return;
    }

    String deleteErrorMessage = db.deleteRow(key);
    if (deleteErrorMessage != null) {
      DataStorageUtils.error(deleteErrorMessage, db, call);
    } else {
      DataStorageUtils.success(new JSObject(), db, call);
    }
  }

  @PluginMethod()
  public void drop(PluginCall call) {
    String table = DataStorageUtils.getNoEmptyString("table", call);
    if (table == null) {
      call.error(DataStorageError.EmptyTable);
      return;
    }

    SqliteDB db = new SqliteDB(this.dbName, table);
    String errorMessage = db.open(bridge);
    if (errorMessage != null) {
      DataStorageUtils.error(errorMessage, db, call);
      return;
    }

    String dropErrorMessage = db.dropTable();
    if (dropErrorMessage != null) {
      DataStorageUtils.error(dropErrorMessage, db, call);
    } else {
      DataStorageUtils.success(new JSObject(), db, call);
    }
  }

  @PluginMethod()
  public void retrieve(PluginCall call) {
    String table = DataStorageUtils.getNoEmptyString("table", call);
    if (table == null) {
      call.error(DataStorageError.EmptyTable);
      return;
    }

    String key = DataStorageUtils.getNoEmptyString("key", call);
    if (key == null) {
      call.error(DataStorageError.EmptyKey);
      return;
    }

    SqliteDB db = new SqliteDB(this.dbName, table);
    String errorMessage = db.open(bridge);
    if (errorMessage != null) {
      DataStorageUtils.error(errorMessage, db, call);
      return;
    }

    String storedValue = db.selectOne(key);
    if (storedValue == null) {
      DataStorageUtils.error(DataStorageError.SelectStatement, db, call);
    } else {
      JSObject value = DataStorageUtils.jsonParse(storedValue);
      if (value == null) {
        DataStorageUtils.error(DataStorageError.JsonParse, db, call);
      } else {
        DataStorageUtils.success(value, db, call);
      }
    }
  }

  @PluginMethod()
  public void store(PluginCall call) {
    String table = DataStorageUtils.getNoEmptyString("table", call);
    if (table == null) {
      call.error(DataStorageError.EmptyTable);
      return;
    }

    String key = DataStorageUtils.getNoEmptyString("key", call);
    if (key == null) {
      call.error(DataStorageError.EmptyKey);
      return;
    }

    JSObject objectValue = DataStorageUtils.getObjectToStore("value", call);
    if (objectValue == null) {
      call.error(DataStorageError.EmptyValue);
      return;
    }

    String value = objectValue.toString();

    SqliteDB db = new SqliteDB(this.dbName, table);
    String errorMessage = db.open(bridge);
    if (errorMessage != null) {
      DataStorageUtils.error(errorMessage, db, call);
      return;
    }

    String createErrorMessage = db.createTable();
    if (createErrorMessage != null) {
      DataStorageUtils.error(createErrorMessage, db, call);
    } else {
      String insertErrorMessage = db.insert(key, value);
      if (insertErrorMessage != null) {
        DataStorageUtils.error(insertErrorMessage, db, call);
      } else {
        DataStorageUtils.success(new JSObject(), db, call);
      }
    }
  }

}
