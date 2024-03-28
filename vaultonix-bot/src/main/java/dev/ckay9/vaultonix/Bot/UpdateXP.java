package dev.ckay9.vaultonix.Bot;

public class UpdateXP {
  public String guild_id;
  public int xp_change;
  public String user_id;

  public UpdateXP(String guild_id, int xp_change, String user_id) {
    this.guild_id = guild_id;
    this.xp_change = xp_change;
    this.user_id = user_id;
  }
}
