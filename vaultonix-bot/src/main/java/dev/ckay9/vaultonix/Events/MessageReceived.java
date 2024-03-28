package dev.ckay9.vaultonix.Events;

import dev.ckay9.vaultonix.Bot.GuildUser;
import dev.ckay9.vaultonix.Bot.Helpers;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class MessageReceived extends ListenerAdapter {
  @Override
  public void onMessageReceived(MessageReceivedEvent event) {
    if (event.getAuthor().isBot())
      return;

    User author = event.getAuthor();
    Guild guild = event.getGuild();
    MessageChannelUnion channel = event.getChannel();
    if (channel.getType() != ChannelType.TEXT)
      return;

    GuildUser initial_user = Helpers.getUser(guild.getId(), author.getId()); // used for comparison
    GuildUser xp_response = Helpers.addXP(guild.getId(), author.getId(), 10);
    if (initial_user == null || xp_response == null) return;

    if (initial_user.level < xp_response.level) {
      Helpers.onLevelUp(event.getMember(), guild, xp_response.level, (TextChannel)channel);
    }
  }
}
