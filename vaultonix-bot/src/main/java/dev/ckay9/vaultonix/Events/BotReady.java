package dev.ckay9.vaultonix.Events;

import java.util.List;

import org.apache.http.Header;
import org.apache.http.message.BasicHeader;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class BotReady extends ListenerAdapter {
  @Override
  public void onReady(ReadyEvent event) {
    JDA jda = event.getJDA();
    List<Guild> guilds = jda.getGuilds();

    for (Guild guild : guilds) {
      List<Member> members = guild.getMembers();
      for (Member member : members) {
        if (member.getUser().isBot()) continue;
        // Create Guild Users
        HTTP.getRequest(Vaultonix.API_HOST + "/user/guild?guild_id=" + guild.getId() + "&user_id=" + member.getId(), new Header[]{
          new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
        });
      }
    }
  }
}
