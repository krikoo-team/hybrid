package com.krikoo.capacitor.sharer.models;

import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONException;

public class ShareEmailOptions {

  public String app = "DEFAULT";
  public String[] bcc = {};
  public String body = "";
  public String[] cc = {};
  public Boolean hasParams = false;
  public Boolean isHTML = false;
  public String subject = "";
  public String[] to = {};

  public ShareEmailOptions(JSObject email) {
    app = email.getString("app", app);
    app = app.isEmpty() ? "DEFAULT" : app;
    bcc = convertToArray(email, "bcc");
    body = email.getString("body", "");
    cc = convertToArray(email, "cc");
    isHTML = email.getBoolean("isHTML", isHTML);
    subject = email.getString("subject", "");
    to = convertToArray(email, "to");
    hasParams = !(isEmpty(bcc) && body.isEmpty() && isEmpty(cc) && subject.isEmpty() && isEmpty(to));
  }

  private String[] convertToArray(JSObject email, String param) {
    String[] list = {};
    try {
      JSONArray jsonArray = email.getJSONArray(param);
      list = new String[jsonArray.length()];
      for (int i = 0; i < jsonArray.length(); i++) {
        try {
          list[i] = jsonArray.getString(i);
        } catch (JSONException ignored) {
        }
      }
    } catch (JSONException ignored) {
    }
    return list;
  }

  private Boolean isEmpty(String[] array) {
    return array.length == 0;
  }

}
