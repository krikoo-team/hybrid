package com.krikoo.capacitor.filepicker;

import android.content.Context;
import android.net.Uri;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class FilePickerUtils {

  public static String readFile(String path, Context context) throws IOException {
    InputStream is = getInputStream(path, context);
    return readFileAsBase64EncodedData(is);
  }

  private static String readFileAsBase64EncodedData(InputStream is) throws IOException {
    FileInputStream fileInputStreamReader = (FileInputStream) is;
    ByteArrayOutputStream byteStream = new ByteArrayOutputStream();

    byte[] buffer = new byte[1024];

    int c;
    while ((c = fileInputStreamReader.read(buffer)) != -1) {
      byteStream.write(buffer, 0, c);
    }
    fileInputStreamReader.close();

    return Base64.encodeToString(byteStream.toByteArray(), Base64.NO_WRAP);
  }

  private static InputStream getInputStream(String path, Context context) throws FileNotFoundException {
    Uri u = Uri.parse(path);
    if (u.getScheme().equals("content")) {
      return context.getContentResolver().openInputStream(u);
    } else {
      return new FileInputStream(new File(u.getPath()));
    }
  }

}
