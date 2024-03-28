package dev.ckay9.vaultonix.Events;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

class GoodbyeResponse {
  public String goodbye;
  public String channel_id;
  public boolean enabled;
}

public class MemberLeave extends ListenerAdapter {
  @Override
  public void onGuildMemberRemove(GuildMemberRemoveEvent event) {
    try {
      Guild guild = event.getGuild();
      User user = event.getUser();

      CloseableHttpResponse goodbye_request = HTTP
        .getRequest(Vaultonix.API_HOST + "/guild/welcome_goodbye?guild_id=" + guild.getId(), new Header[] {});
      HttpEntity goodbye_entity = goodbye_request.getEntity();
      Gson gson = new Gson();
      GoodbyeResponse goodbye_response = gson.fromJson(EntityUtils.toString(goodbye_entity, "UTF-8"),
        GoodbyeResponse.class);
      if (!goodbye_response.enabled)
        return;
      if (goodbye_response.channel_id.length() <= 0)
        return;

      TextChannel channel = guild.getChannelById(TextChannel.class, goodbye_response.channel_id);
      if (channel == null)
        return;

      String final_message = goodbye_response.goodbye.replace("{username}", "<@" + user.getId() + ">");
      final_message = final_message.replace("{guild}", guild.getName());
      final_message = final_message.replace("{count}", String.valueOf(guild.getMembers().size()));

      channel.sendMessage(final_message).queue();
    } catch (IOException ex) {
      System.out.println(ex.toString());
    }
  }
}
