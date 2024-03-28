package dev.ckay9.vaultonix.Commands;

import java.awt.Color;

import org.apache.http.Header;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import dev.ckay9.vaultonix.Bot.NewTrade;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.IMentionable;
import net.dv8tion.jda.api.entities.channel.Channel;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.Command.Option;

public class CommandHandler extends ListenerAdapter {
  private void handleAboutCommand(SlashCommandInteractionEvent event) {
    EmbedBuilder builder = new EmbedBuilder();
    builder.setTitle("About Vaultonix", Vaultonix.FRONTEND_HOST);
    builder.setColor(Color.CYAN);
    builder.setDescription("Learn about Vaultonix and what it is.");
    builder.addField("Overview", "Vaultonix is a Discord bot that offers admin tools, minigames, quality-of-life changes, and much more to servers. Vaultonix aims to provide a fun, side expierence for Discord servers and allow communities to engage better.", false);
    builder.addField("Technical Overview", "Vaultonix is written using JDA (Bot), NextJS (Frontend), and NestJS (Backend). It can be found on GitHub at https://github.com/CKAY-9/vaultonix", false);
    builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());

    event.replyEmbeds(builder.build()).queue();
  }

  private void handleLeaderboardCommand(SlashCommandInteractionEvent event) {
    EmbedBuilder builder = new EmbedBuilder();
    builder.setTitle("Vaultonix Leaderboard", Vaultonix.FRONTEND_HOST);
    builder.setColor(Color.CYAN);
    builder.setDescription("See " + event.getGuild().getName() + "'s Leaderboard on Vaultonix.");
    builder.addField("Leaderboard", "You can view this guild's leaderboard at " + Vaultonix.FRONTEND_HOST + "/vaultonix/leaderboard/" + event.getGuild().getId() + ".", false);
    builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());

    event.replyEmbeds(builder.build()).queue();
  }

  private void handleTradeCommand(SlashCommandInteractionEvent event) {
    OptionMapping option = event.getOption("trade_partner");
    if (option == null) return;

    IMentionable mentionable = option.getAsMentionable();
    String partner_id = mentionable.getId();
    String user_id = event.getUser().getId();

    CloseableHttpResponse response = HTTP.postRequest(
      new NewTrade(user_id, partner_id, event.getGuild().getId()), 
      Vaultonix.API_HOST + "/trade", 
      new Header[]{
        new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
      });
  }

  private void handleInventoryCommand(SlashCommandInteractionEvent event) {
    EmbedBuilder builder = new EmbedBuilder();
    builder.setTitle("Vaultonix Inventory", Vaultonix.FRONTEND_HOST);
    builder.setColor(Color.CYAN);
    builder.setDescription("See your inventory for " + event.getGuild().getName() + " on Vaultonix.");
    builder.addField("Inventory", "You can view your inventory for this guild at " + Vaultonix.FRONTEND_HOST + "/vaultonix/inventory/" + event.getGuild().getId() + ".", false);
    builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());

    event.replyEmbeds(builder.build()).queue();
  }

  @Override
  public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
    Channel channel = event.getChannel();
    if (channel.getType() != ChannelType.TEXT) return;

    switch (event.getName()) {
      case "about":
        handleAboutCommand(event);    
        break;
      case "leaderboard":
        handleLeaderboardCommand(event);
        break;
      case "trade":
        handleTradeCommand(event);
        break;
      case "inventory":
        handleInventoryCommand(event);
        break;
      default:
        break;
    }
  }
}
