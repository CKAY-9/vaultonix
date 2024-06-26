package dev.ckay9.vaultonix.Events;

import org.apache.http.Header;
import org.apache.http.HttpHeaders;
import org.apache.http.message.BasicHeader;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.events.guild.GuildJoinEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

class NewServerRequest {
  String guild_name;
  String guild_id;
  String guild_owner;
}

public class GuildJoin extends ListenerAdapter {
  @Override
  public void onGuildJoin(GuildJoinEvent event) {
    Guild guild = event.getGuild();
    NewServerRequest req_data = new NewServerRequest();
    req_data.guild_id = guild.getId();
    req_data.guild_name = guild.getName();
    req_data.guild_owner = guild.getOwnerId();

    HTTP.postRequest((Object) req_data, Vaultonix.API_HOST + "/bot/guild",
      new Header[] {
        new BasicHeader(HttpHeaders.AUTHORIZATION, Vaultonix.BOT_AUTH_KEY)
      });
  }
}
