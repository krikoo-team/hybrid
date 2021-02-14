package com.krikoo.capacitor.sharer;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.text.Html;
import android.webkit.MimeTypeMap;

import androidx.core.content.FileProvider;

import com.getcapacitor.Bridge;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import com.krikoo.capacitor.sharer.models.ShareEmailApp;
import com.krikoo.capacitor.sharer.models.ShareEmailOptions;
import com.krikoo.capacitor.sharer.models.SharerError;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;

public class SharerUtils extends FileProvider {

  public static String getAlias(String app) {
    switch (app) {
      case ShareEmailApp.Gmail:
      case ShareEmailApp.Default:
        return "com.google.android.gm";
      case ShareEmailApp.Outlook:
        return "com.microsoft.office.outlook";
      case ShareEmailApp.Yahoo:
        return "com.yahoo.mobile.client.android.mail";
      default:
        return app;
    }
  }

  public static Boolean setTextAndUrlIntent(Intent intent, PluginCall call, Context context) {
    String text = call.getString("text");
    String url = call.getString("url");
    if (text != null) {
      if (url != null && url.startsWith("http")) {
        text = text + " " + url;
      }
      intent.putExtra(Intent.EXTRA_TEXT, text);
      intent.setTypeAndNormalize("text/plain");
    } else if (url != null) {
      if (url.startsWith("http")) {
        intent.putExtra(Intent.EXTRA_TEXT, url);
        intent.setTypeAndNormalize("text/plain");
      } else if (url.startsWith("file:")) {
        String type = getMimeType(url);
        intent.setType(type);
        String path = Uri.parse(url).getPath();
        if (path != null) {
          Uri fileUrl = FileProvider.getUriForFile(context, context.getPackageName(), new File(path));
          intent.putExtra(Intent.EXTRA_STREAM, fileUrl);
        }
      } else {
        call.error(SharerError.UnsupportedUrl);
        return false;
      }
    }
    return true;
  }

  public static Boolean setFilesIntent(Intent intent, PluginCall call, Bridge bridge, Context context) {
    ArrayList<Uri> fileUris = SharerUtils.getFiles(call, bridge, context);
    if (fileUris == null) {
      return false;
    } else {
      if (!fileUris.isEmpty()) {
        intent.putExtra(Intent.EXTRA_STREAM, fileUris);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        if (fileUris.size() == 1) {
          intent.setTypeAndNormalize(SharerUtils.getMimeType(fileUris.get(0).toString()));
        }
      }
      return true;
    }
  }

  public static Boolean setEmailIntent(Intent intent, PluginCall call, Context context) {
    JSObject email = call.getObject("email", null);
    if (email == null) {
      return true;
    } else {
      ShareEmailOptions shareEmailOptions = new ShareEmailOptions(email);

      String alias = SharerUtils.getAlias(shareEmailOptions.app);
      PackageManager pm = context.getPackageManager();
      try {
        ApplicationInfo info = pm.getApplicationInfo(alias, 0);
        if (info.enabled) {
          intent.setPackage(info.packageName);
        }
      } catch (PackageManager.NameNotFoundException ignored) {
        call.error(SharerError.AppNotFound);
        return false;
      }

      if (shareEmailOptions.to.length > 0) {
        intent.putExtra(Intent.EXTRA_EMAIL, shareEmailOptions.to);
      }
      if (!shareEmailOptions.subject.isEmpty()) {
        intent.putExtra(Intent.EXTRA_SUBJECT, shareEmailOptions.subject);
      }
      if (shareEmailOptions.bcc.length > 0) {
        intent.putExtra(Intent.EXTRA_BCC, shareEmailOptions.bcc);
      }
      if (shareEmailOptions.cc.length > 0) {
        intent.putExtra(Intent.EXTRA_CC, shareEmailOptions.cc);
      }

      String body = shareEmailOptions.body;
      Boolean isHTML = shareEmailOptions.isHTML;
      if (!body.isEmpty()) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          intent.putExtra(Intent.EXTRA_TEXT, isHTML ? Html.fromHtml(body, Html.FROM_HTML_MODE_LEGACY).toString() : body);
        } else {
          intent.putExtra(Intent.EXTRA_TEXT, isHTML ? Html.fromHtml(body).toString() : body);
        }
      }
      return true;
    }
  }

  public static ArrayList<Uri> getFiles(PluginCall call, Bridge bridge, Context context) {
    JSArray files = call.getArray("files");
    ArrayList<Uri> fileUris = new ArrayList<>();

    // TODO: Remove temp folder.

    if (files != null && files.length() != 0) {
      try {
        for (Object fileJsonObject : files.toList()) {
          if (fileJsonObject instanceof JSONObject) {
            JSObject shareOptionFile = JSObject.fromJSONObject((JSONObject) fileJsonObject);
            String directory = shareOptionFile.getString("directory");

            String path = shareOptionFile.getString("path", "");
            if (path.isEmpty()) {
              call.reject(SharerError.EmptyFilePath);
              return null;
            }

            File fileObject;
            String displayableName = shareOptionFile.getString("displayableName", "");
            if (displayableName.isEmpty()){
              fileObject = getFileObject(path, directory, bridge);
            } else {
              String tempDirectory = "CACHE";
              File fromFileObject = SharerUtils.getFileObject(path, directory, bridge);
              File toFileObject = SharerUtils.getFileObject(displayableName, tempDirectory, bridge);

              if (fromFileObject.equals(null)) {
                call.reject(SharerError.CopyFileToTemp, "Error getting from file object.");
                return null;
              }

              if (toFileObject.equals(null)) {
                call.reject( SharerError.CopyFileToTemp, "Error getting to file object.");
                return null;
              }

              try {
                SharerUtils.copyRecursively(fromFileObject, toFileObject);
                fileObject = SharerUtils.getFileObject(displayableName, tempDirectory, bridge);
              } catch (IOException e) {
                call.reject(SharerError.CopyFileToTemp, e);
                return null;
              }
            }

            if (fileObject != null) {
              try {
                Uri fileUri = SharerUtils.getUriForFile(context, context.getPackageName(), fileObject);
                fileUris.add(fileUri);
              } catch (IllegalArgumentException e) {
                call.reject(SharerError.FileConversion, e);
                return null;
              }
            } else {
              call.reject(SharerError.FileToUri);
              return null;
            }
          } else {
            call.reject(SharerError.InvalidFileParam);
            return null;
          }
        }
      } catch (JSONException e) {
        call.reject(SharerError.InvalidFileParam, e);
        return null;
      }
    }
    return fileUris;
  }

  public static String getMimeType(String url) {
    String type = null;
    String extension = MimeTypeMap.getFileExtensionFromUrl(url);
    if (extension != null) {
      type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
    }
    return type;
  }

  private static void copyRecursively(File src, File dst) throws IOException {
    if (src.isDirectory()) {
      dst.mkdir();

      for (String file : src.list()) {
        SharerUtils.copyRecursively(new File(src, file), new File(dst, file));
      }

      return;
    }

    if (!dst.getParentFile().exists()) {
      dst.getParentFile().mkdirs();
    }

    if (!dst.exists()) {
      dst.createNewFile();
    }

    try (FileChannel source = new FileInputStream(src).getChannel(); FileChannel destination = new FileOutputStream(dst).getChannel()) {
      destination.transferFrom(source, 0, source.size());
    }
  }

  private static File getDirectory(String directory, Bridge bridge) {
    Context c = bridge.getContext();
    switch (directory) {
      case "DATA":
        return c.getFilesDir();
      case "CACHE":
        return c.getCacheDir();
      case "EXTERNAL":
        return c.getExternalFilesDir(null);
      case "EXTERNAL_STORAGE":
        return Environment.getExternalStorageDirectory();
      default:
        return Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);
    }
  }

  private static File getFileObject(String path, String directory, Bridge bridge) {
    File androidDirectory = getDirectory(directory, bridge);
    if (!androidDirectory.exists()) {
      androidDirectory.mkdir();
    }
    return new File(androidDirectory, path);
  }

}
