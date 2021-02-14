package com.krikoo.capacitor.filepicker;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.webkit.MimeTypeMap;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.krikoo.capacitor.filepicker.models.FilePickerError;

import java.io.IOException;

@NativePlugin(requestCodes = {FilePicker.FILE_PICK})
public class FilePicker extends Plugin {

  protected static final int FILE_PICK = 1010;

  @PluginMethod()
  public void present(PluginCall call) {
    saveCall(call);
    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
    intent.setType("*/*");
    startActivityForResult(call, intent, FILE_PICK);
  }

  @Override
  protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
    super.handleOnActivityResult(requestCode, resultCode, data);
    PluginCall call = getSavedCall();
    switch (resultCode) {
      case Activity.RESULT_OK:
        if (requestCode == FILE_PICK) {
          if (data != null) {
            String mimeType = getContext().getContentResolver().getType(data.getData());
            String extension = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType);

            Cursor c = getContext().getContentResolver().query(data.getData(), null, null, null, null);
            c.moveToFirst();
            String name = c.getString(c.getColumnIndex(OpenableColumns.DISPLAY_NAME));

            String base64 = "";
            try {
              base64 = FilePickerUtils.readFile(data.getDataString(), getContext());
            } catch (IOException e) {
              call.reject(FilePickerError.ReadingFile);
              break;
            }

            JSObject filePickerResult = new JSObject();
            filePickerResult.put("data", base64);
            filePickerResult.put("uri", data.getDataString());
            filePickerResult.put("name", name);
            filePickerResult.put("mimeType", mimeType);
            filePickerResult.put("extension", extension);
            call.success(filePickerResult);
          } else {
            call.reject(FilePickerError.Cancelled);
          }
        } else {
          call.reject(FilePickerError.NoDataRetrieved);
        }
        break;
      case Activity.RESULT_CANCELED:
        call.reject(FilePickerError.WrongRequestCode);
        break;
      default:
        call.reject(FilePickerError.Unknown);
        break;
    }

  }
}
