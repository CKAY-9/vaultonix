package dev.ckay9.vaultonix.Events.Logs;

import java.awt.Color;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.jetbrains.annotations.Nullable;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.EventType;
import dev.ckay9.vaultonix.Bot.EventTypes;
import dev.ckay9.vaultonix.Bot.HTTP;
import dev.ckay9.vaultonix.Bot.LoggingResponse;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.audit.AuditLogEntry;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.Channel;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.events.guild.GuildAuditLogEntryCreateEvent;
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.api.events.guild.member.GuildMemberRemoveEvent;
import net.dv8tion.jda.api.events.guild.member.GuildMemberRoleAddEvent;
import net.dv8tion.jda.api.events.guild.member.GuildMemberRoleRemoveEvent;
import net.dv8tion.jda.api.events.message.MessageUpdateEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class Logs extends ListenerAdapter {
  private boolean isEventEnabled(String guild_id, String event_key) {
    try {
      CloseableHttpResponse response = HTTP.getRequest(Vaultonix.API_HOST + "/guild/logging?guild_id=" + guild_id,
          new Header[] {
              new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
          });
      if (response.getStatusLine().getStatusCode() != 200)
        return false;

      Gson gson = new Gson();
      HttpEntity entity = response.getEntity();
      LoggingResponse parsed = gson.fromJson(EntityUtils.toString(entity), LoggingResponse.class);
      if (parsed == null)
        return false;

      if (!parsed.enabled)
        return false;

      Map<String, Boolean> events = gson.fromJson(parsed.actions_to_log, Map.class.getGenericSuperclass());
      if (events == null)
        return false;

      Boolean b = events.get(event_key);
      if (b == null)
        return false;

      return b;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return false;
    }
  }

  private void logEvent(Guild guild, User[] users, @Nullable Channel channel,  @Nullable JDA jda, String message, EventType type) {
    try {
      CloseableHttpResponse response = HTTP.getRequest(Vaultonix.API_HOST + "/guild/logging?guild_id=" + guild.getId(), new Header[]{
        new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
      });
      HttpEntity entity = response.getEntity();
      Gson gson = new Gson();
      LoggingResponse logging_response = gson.fromJson(EntityUtils.toString(entity), LoggingResponse.class);
      if (
        logging_response == null || 
        logging_response.channel_id == "" || 
        !logging_response.enabled ||
        logging_response.guild_id == ""
      ) return;

      TextChannel log_channel = guild.getChannelById(TextChannel.class, logging_response.channel_id);
      if (log_channel == null) return;

      EmbedBuilder builder = new EmbedBuilder();
      builder.setTitle("Event Log", Vaultonix.FRONTEND_HOST);
      builder.setColor(Color.CYAN);
      builder.setDescription("Type: " + EventTypes.convertToString(type));
      for (int i = 0; i < users.length; i++) {
        User temp = users[i];
        builder.addField("User", temp.getAsMention() + "(" + temp.getName() + ")", true);
      }
      if (channel != null) {
        builder.addField("Channel", channel.getAsMention() + "(" + channel.getName() + ")", false);
      }
      builder.addField("Message", message, false);
      builder.setFooter("Thanks for using Vaultonix", jda.getSelfUser().getAvatarUrl());
      log_channel.sendMessageEmbeds(builder.build()).queue();
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return;
    }
  }

  // Handles: join
  @Override
  public void onGuildMemberJoin(GuildMemberJoinEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "join");
    if (!enabled)
      return;

    User user = event.getUser();

    logEvent(
      guild, 
      new User[]{user}, 
      null, 
      event.getJDA(), 
      user.getName() + " joined the server.", 
      EventType.JOIN
    );
  }

  // Handles: kick, ban, disconnect
  @Override
  public void onGuildMemberRemove(GuildMemberRemoveEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "leave");
    if (!enabled)
      return;

    User user = event.getUser();

    logEvent(
      guild, 
      new User[]{user}, 
      null, 
      event.getJDA(), 
      user.getName() + " left the server.", 
      EventType.LEAVE
    );
  }

  @Override
  public void onGuildMemberRoleAdd(GuildMemberRoleAddEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "role_update");
    if (!enabled)
      return;

    User user = event.getUser();
    List<Role> roles = event.getRoles();
    int length = event.getRoles().size();
    String[] role_names = new String[length];
    String[] role_ids = new String[length];
    for (int i = 0; i < length; i++) {
      Role role = roles.get(i);
      role_ids[i] = role.getId();
      role_names[i] = role.getName();
    }

    logEvent(
      guild, 
      new User[]{user}, 
      null, 
      event.getJDA(), 
      user.getName() + " received " + length + " roles. Role Names: " + role_names.toString() + ", Role IDs: " + role_ids.toString(), 
      EventType.ROLE_UPDATE
    );
  }

  @Override
  public void onGuildMemberRoleRemove(GuildMemberRoleRemoveEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "role_update");
    if (!enabled)
      return;
  
    User user = event.getUser();
    List<Role> roles = event.getRoles();
    int length = event.getRoles().size();
    String[] role_names = new String[length];
    String[] role_ids = new String[length];
    for (int i = 0; i < length; i++) {
      Role role = roles.get(i);
      role_ids[i] = role.getId();
      role_names[i] = role.getName();
    }
  
    logEvent(
      guild, 
      new User[]{user}, 
      null, 
      event.getJDA(), 
      user.getName() + " was strip of " + length + " roles. Role Names: " + role_names.toString() + ", Role IDs: " + role_ids.toString(), 
      EventType.ROLE_UPDATE
    );
  }


  @Override
  public void onMessageUpdate(MessageUpdateEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "message_update");
    if (!enabled)
      return;

    MessageChannelUnion channel = event.getChannel();
    User user = event.getAuthor();
    Message message = event.getMessage();

    logEvent(
      guild, 
      new User[]{user}, 
      channel, 
      event.getJDA(), 
      user.getName() + " updated message in " + channel.getAsMention() + "(" + channel.getName() + "). Message: " + message.getContentRaw(), 
      EventType.MESSAGE_UPDATE
    );
  }

  // Handles:
  @Override
  public void onGuildAuditLogEntryCreate(GuildAuditLogEntryCreateEvent event) {
    Guild guild = event.getGuild();
    boolean enabled = isEventEnabled(guild.getId(), "server_update");
    if (!enabled)
      return;

    AuditLogEntry entry = event.getEntry();
    User user = entry.getUser();
    String reason = entry.getReason();
    String target_id = entry.getTargetId(); // TOOD: figure out what this is

    logEvent(
      guild, 
      new User[]{user}, 
      null, 
      event.getJDA(), 
      user.getName() + " created an audit log. Reason: " + reason + ". Target ID: " + target_id,
      EventType.SERVER_UPDATE
    );
  }
}
