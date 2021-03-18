package com.krikoo.capacitor.opener;

import android.content.Intent;
import android.net.Uri;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.krikoo.capacitor.opener.models.OpenerError;

@NativePlugin()
public class Opener extends Plugin {

  private static final int SEND_REQUEST_CODE = 2545;

  @PluginMethod()
  public void open(PluginCall call) {
    Intent intent = new Intent(Intent.ACTION_VIEW);

    String dialogTitle = call.getString("dialogTitle", "");
    String path = call.getString("path", "");
    String url = call.getString("url", "");

    Uri fileUri;
    if (path.isEmpty() && url.isEmpty()) {
      call.reject(OpenerError.EmptyFilePathAndUrl);
      return;
    } else if (!path.isEmpty()) {
      fileUri = OpenerUtils.getUriByPathAndDirectory(call, bridge, getContext());
    } else {
      fileUri = OpenerUtils.getUriByUrl(call, bridge, getContext());
    }

    if (fileUri == null) {
      call.reject(OpenerError.EmptyData);
      return;
    } else {
      intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
      String type = OpenerUtils.getMimeType(fileUri.toString());
      intent.setDataAndType(fileUri, type);
    }

    Intent chooser = Intent.createChooser(intent, dialogTitle);
    chooser.addCategory(Intent.CATEGORY_DEFAULT);
    startActivityForResult(call, chooser, SEND_REQUEST_CODE);
    call.success();
  }

}
