package com.krikoo.capacitor.datastorage.models;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.getcapacitor.Bridge;

import java.io.File;

public class SqliteDB {

  private SQLiteDatabase db = null;
  private String dbName;
  private String tableName;

  public SqliteDB(String dbName, String tableName) {
    this.dbName = dbName;
    this.tableName = tableName;
  }

  public void close() {
    db.close();
  }

  public String createTable() {
    String createTableString = String.format("CREATE TABLE IF NOT EXISTS %s (key TEXT PRIMARY KEY,value TEXT);", tableName);
    try {
      db.execSQL(createTableString);
      Log.i("DATA STORAGE", String.format("%s/%s: Successfully created table.", this.dbName, this.tableName));
      return null;
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s/%s: CREATE TABLE statement could not be prepared.", this.dbName, this.tableName));
      Log.e("DATA STORAGE", e.getMessage() == null ? "Undefined" : e.getMessage());
      return DataStorageError.OpenDatabase;
    }
  }

  public String deleteRow(String key) {
    try {
      db.delete(tableName, "key = ?", new String[]{key});
      Log.i("DATA STORAGE", String.format("%s/%s/%s: Successfully deleted row.", this.dbName, this.tableName, key));
      return null;
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s/%s/%s: DELETE statement could not be prepared. %s", this.dbName, this.tableName, key, e.getMessage()));
      if (e.getMessage() != null && e.getMessage().contains("no such table")) {
        return DataStorageError.TableNotFound;
      } else {
        return DataStorageError.Delete;
      }
    }
  }

  public String dropTable() {
    String dropTableString = String.format("DROP TABLE %s;", tableName);
    try {
      db.execSQL(dropTableString);
      Log.i("DATA STORAGE", String.format("%s/%s: Successfully dropped table.", this.dbName, this.tableName));
      return null;
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s/%s: DROP TABLE statement could not be prepared. %s", this.dbName, this.tableName, e.getMessage()));
      if (e.getMessage() != null && e.getMessage().contains("no such table")) {
        return DataStorageError.TableNotFound;
      } else {
        return DataStorageError.DropTable;
      }
    }
  }

  public String insert(String key, String value) {
    try {
      ContentValues contentValues = new ContentValues();
      contentValues.put("key", key);
      contentValues.put("value", value);
      db.replace(tableName, null, contentValues);
      Log.i("DATA STORAGE", String.format("%s/%s/%s: Successfully inserted or replaced row.", this.dbName, this.tableName, key));
      return null;
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s/%s/%s: INSERT OR REPLACE statement could not be prepared.", this.dbName, this.tableName, key));
      Log.e("DATA STORAGE", e.getMessage() == null ? "Undefined" : e.getMessage());
      return DataStorageError.InsetOrReplace;
    }
  }

  public String open(Bridge bridge) {
    try {
      Context c = bridge.getContext();
      File file = new File(c.getFilesDir(), this.dbName);
      this.db = SQLiteDatabase.openOrCreateDatabase(file.getPath(), null, null);
      Log.i("DATA STORAGE", String.format("%s: Successfully opened connection to database.", this.dbName));
      return null;
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s: Error opening database.", this.dbName));
      return DataStorageError.OpenDatabase;
    }
  }

  public String selectOne(String key) {
    Cursor cursor = select(key);
    if (cursor == null) {
      return null;
    } else if (cursor.getCount() == 0) {
      return "{value: null}";
    } else {
      cursor.moveToFirst();
      return cursor.getString(1);
    }
  }

  public String removeDatabase(Bridge bridge) {
    try {
      Context c = bridge.getContext();
      File file = new File(c.getFilesDir(), this.dbName);
      if (!file.exists()) {
        return DataStorageError.DatabaseNotFound;
      } else {
        file.delete();
        Log.i("DATA STORAGE", String.format("%s: Successfully deleted database.", this.dbName));
        return null;
      }
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s: Database does not exist.", this.dbName));
      return DataStorageError.RemoveDatabase;
    }

  }

  private Cursor select(String key) {
    String whereStatementString = key != null && key.isEmpty() ? String.format("WHERE key = '%s'", key) : "";
    String selectStatementString = String.format("SELECT * FROM %s %s;", tableName, whereStatementString);
    try {
      return db.rawQuery(selectStatementString, null);
    } catch (Exception e) {
      Log.i("DATA STORAGE", String.format("%s/%s: %s statement could not be prepared. %s", dbName, tableName, selectStatementString, e.getMessage()));
      if (e.getMessage() != null && e.getMessage().contains("no such table")) {
        String mockStatement = String.format("SELECT \"%s\" as \"key\", \"{value: null}\" as \"value\";", key);
        return db.rawQuery(mockStatement, null);
      } else {
        return null;
      }
    }
  }

}
