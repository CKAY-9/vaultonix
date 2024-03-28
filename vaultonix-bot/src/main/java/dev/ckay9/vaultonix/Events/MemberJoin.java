package dev.ckay9.vaultonix.Events;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

class ConfigResponse {
  public String[] join_roles;
}

class WelcomeResponse {
  public String welcome;
  public String channel_id;
  public boolean enabled;
}

public class MemberJoin extends ListenerAdapter {
  @Override
  public void onGuildMemberJoin(GuildMemberJoinEvent event) {
    try {
      Guild guild = event.getGuild();
      Member user = event.getMember();

      CloseableHttpResponse response = HTTP.getRequest(Vaultonix.API_HOST + "/guild/config?guild_id=" + guild.getId(),
        new Header[] {
          new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
        });
      Gson gson = new Gson();
      HttpEntity entity = response.getEntity();
      ConfigResponse parsed = gson.fromJson(EntityUtils.toString(entity, "UTF-8"), ConfigResponse.class);

      for (int i = 0; i < parsed.join_roles.length; i++) {
        Role role = guild.getRoleById(parsed.join_roles[i]);
        guild.addRoleToMember(user.getUser(), role).queue();
      }

      CloseableHttpResponse welcome_response = HTTP
        .getRequest(Vaultonix.API_HOST + "/guild/welcome_goodbye?guild_id=" + guild.getId(), new Header[] {
          new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
        });
      HttpEntity welcome_entity = welcome_response.getEntity();
      WelcomeResponse welcome_parsed = gson.fromJson(EntityUtils.toString(welcome_entity, "UTF-8"),
        WelcomeResponse.class);
      if (!welcome_parsed.enabled)
        return;
      if (welcome_parsed.channel_id.length() <= 0)
        return;

      TextChannel channel = guild.getChannelById(TextChannel.class, welcome_parsed.channel_id);
      if (channel == null)
        return;

      String final_message = welcome_parsed.welcome.replace("{username}", "<@" + user.getId() + ">");
      final_message = final_message.replace("{guild}", guild.getName());
      final_message = final_message.replace("{count}", String.valueOf(guild.getMembers().size() + 1));

      channel.sendMessage(final_message).queue();
    } catch (IOException ex) {
      System.out.println(ex.toString());
    }
  }
}
