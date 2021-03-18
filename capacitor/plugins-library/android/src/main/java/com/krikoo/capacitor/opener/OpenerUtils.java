package com.krikoo.capacitor.opener;

import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.webkit.MimeTypeMap;

import androidx.core.content.FileProvider;

import com.getcapacitor.Bridge;
import com.getcapacitor.PluginCall;

import com.krikoo.capacitor.opener.models.OpenerError;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;

public class OpenerUtils extends FileProvider {

  public static Uri getFile(File file, PluginCall call, Bridge bridge, Context context) {
    String displayableName = call.getString("displayableName", "");

    // TODO: Remove temp folder.
    File fileObject = displayableName.isEmpty() ? file : getTemporaryFileObject(file, displayableName, call, bridge);
    if (fileObject == null) {
      call.reject(OpenerError.FileToUri);
      return null;
    } else {
      try {
        return OpenerUtils.getUriForFile(context, context.getPackageName(), fileObject);
      } catch (IllegalArgumentException e) {
        call.reject(OpenerError.FileConversion, e);
        return null;
      }
    }
  }

  public static String getMimeType(String url) {
    String type = null;
    String extension = MimeTypeMap.getFileExtensionFromUrl(url);
    if (extension != null) {
      type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
    }
    return type;
  }

  public static Uri getUriByPathAndDirectory(PluginCall call, Bridge bridge, Context context) {
    String path = call.getString("path", "");
    String directory = call.getString("directory", "");
    File file = OpenerUtils.getFileObject(path, directory, bridge);
    return OpenerUtils.getFile(file, call, bridge, context);
  }

  public static Uri getUriByUrl(PluginCall call, Bridge bridge, Context context) {
    String url = call.getString("url", "");
    if (!url.startsWith("file:")) {
      call.error(OpenerError.UnsupportedUrl);
      return null;
    } else {
      String path = Uri.parse(url).getPath();
      if (path == null) {
        call.error(OpenerError.UnsupportedUrl);
        return null;
      } else {
        File file = new File(path);
        return OpenerUtils.getFile(file, call, bridge, context);
      }
    }
  }

  private static void copyRecursively(File src, File dst) throws IOException {
    if (src.isDirectory()) {
      dst.mkdir();

      for (String file : src.list()) {
        OpenerUtils.copyRecursively(new File(src, file), new File(dst, file));
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

  private static File getTemporaryFileObject(File fromFile, String displayableName, PluginCall call, Bridge bridge) {
    String tempDirectory = "CACHE";
    File toFileObject = OpenerUtils.getFileObject(displayableName, tempDirectory, bridge);

    if (fromFile == null) {
      call.reject(OpenerError.CopyFileToTemp, "Error getting 'from file' object.");
      return null;
    }

    if (toFileObject == null) {
      call.reject(OpenerError.CopyFileToTemp, "Error getting 'to file' object.");
      return null;
    }

    try {
      OpenerUtils.copyRecursively(fromFile, toFileObject);
      return OpenerUtils.getFileObject(displayableName, tempDirectory, bridge);
    } catch (IOException e) {
      call.reject(OpenerError.CopyFileToTemp, e);
      return null;
    }
  }

}
