package dev.ckay9.vaultonix.Bot;

import java.util.Date;

public class TradeOfferResponse {
  public int id;
  public String user_id;
  public String partner_id;
  public String[] user_items;
  public String[] partner_items;
  public boolean user_confirmed;
  public boolean partner_confirmed;
  public boolean trade_complete;
  public Date completed;
  public String guild_id;
}
