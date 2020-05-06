package com.krikoo.capacitor.sharer;

import android.content.Intent;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.krikoo.capacitor.sharer.models.SharerError;

@NativePlugin()
public class Sharer extends Plugin {

  private static final int SEND_REQUEST_CODE = 2545;

  @PluginMethod()
  public void share(PluginCall call) {
    Intent intent = new Intent(Intent.ACTION_SEND_MULTIPLE);

    if (!SharerUtils.setEmailIntent(intent, call, getContext())) {
      return;
    }

    if (!SharerUtils.setFilesIntent(intent, call, bridge, getContext())) {
      return;
    }

    if (!SharerUtils.setTextAndUrlIntent(intent, call, getContext())) {
      return;
    }

    if (intent.getExtras() == null) {
      call.reject(SharerError.EmptyData);
      return;
    }

    String type = intent.getType();
    if (type == null || type.isEmpty()) {
      intent.setType("text/plain");
    }

    String dialogTitle = call.getString("dialogTitle", "Missing dialog title");

    Intent chooser = Intent.createChooser(intent, dialogTitle);
    chooser.addCategory(Intent.CATEGORY_DEFAULT);
    startActivityForResult(call, chooser, SEND_REQUEST_CODE);
    call.success();
  }

}
