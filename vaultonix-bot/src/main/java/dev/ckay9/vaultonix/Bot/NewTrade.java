package dev.ckay9.vaultonix.Bot;

public class NewTrade {
  public String user_id;
  public String partner_id;
  public String guild_id;

  public NewTrade(String user_id, String partner_id, String guild_id) {
    this.user_id = user_id;
    this.guild_id = guild_id;
    this.partner_id = partner_id;
  }
}
