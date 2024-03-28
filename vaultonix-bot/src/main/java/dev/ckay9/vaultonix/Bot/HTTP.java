package dev.ckay9.vaultonix.Bot;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.google.gson.Gson;

public class HTTP {
  public static CloseableHttpResponse postRequest(Object data, String url, Header[] headers) {
    try {
      CloseableHttpClient client = HttpClients.createDefault();
      HttpPost post = new HttpPost(url);
      Gson gson = new Gson();
      String json_string = gson.toJson(data);
      HttpEntity entity = new StringEntity(json_string, ContentType.APPLICATION_JSON);
      post.setEntity(entity);
      post.setHeaders(headers);
      CloseableHttpResponse response = client.execute(post);
      return response;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }

  public static CloseableHttpResponse deleteRequest(String url, Header[] headers) {
    try {
      CloseableHttpClient client = HttpClients.createDefault();
      HttpDelete delete = new HttpDelete(url);
      delete.setHeaders(headers);
      CloseableHttpResponse response = client.execute(delete);
      return response;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }

  public static CloseableHttpResponse getRequest(String url, Header[] headers) {
    try {
      CloseableHttpClient client = HttpClients.createDefault();
      HttpGet get = new HttpGet(url);
      get.setHeaders(headers);
      CloseableHttpResponse response = client.execute(get);
      return response;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }

  public static CloseableHttpResponse putRequest(String url, Header[] headers, Object data) {
    try {
      CloseableHttpClient client = HttpClients.createDefault();
      HttpPut put = new HttpPut(url);
      Gson gson = new Gson();
      String json_string = gson.toJson(data);
      HttpEntity entity = new StringEntity(json_string, ContentType.APPLICATION_JSON);
      put.setEntity(entity);
      put.setHeaders(headers);
      CloseableHttpResponse response = client.execute(put);
      return response;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }
}
