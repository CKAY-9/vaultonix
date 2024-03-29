package dev.ckay9.vaultonix.Commands;

import java.awt.Color;
import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.Vaultonix;
import dev.ckay9.vaultonix.Bot.HTTP;
import dev.ckay9.vaultonix.Bot.NewTrade;
import dev.ckay9.vaultonix.Bot.TradeOfferResponse;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.IMentionable;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.Channel;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;

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
    try {
      OptionMapping option = event.getOption("trade_partner");
      if (option == null) {
        event.reply("Failed to execute command.");
        return;
      }

      User user = event.getUser();
      IMentionable mentionable = option.getAsMentionable();
      String partner_id = mentionable.getId();
      String user_id = user.getId();

      CloseableHttpResponse response = HTTP.postRequest(
        new NewTrade(user_id, partner_id, event.getGuild().getId()), 
        Vaultonix.API_HOST + "/trade", 
        new Header[]{
          new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
        });
      
      if (response.getStatusLine().getStatusCode() != 200) {
        EmbedBuilder builder = new EmbedBuilder();
        builder.setTitle("Vaultonix Error", Vaultonix.FRONTEND_HOST);
        builder.setColor(Color.RED);
        builder.setDescription("There was an error!");
        builder.addField("Error", "Failed to create trade offer!", false);
        builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());
        event.replyEmbeds(builder.build()).setEphemeral(true).queue();
        return;
      }

      Gson gson = new Gson();
      HttpEntity entity = response.getEntity();
      TradeOfferResponse offer_response = gson.fromJson(EntityUtils.toString(entity, "UTF-8"), TradeOfferResponse.class);
      if (offer_response == null) {
        event.reply("Failed to get response");
        return;
      }

      User partner_user = event.getGuild().getMemberById(partner_id).getUser();

      EmbedBuilder builder = new EmbedBuilder();
      builder.setTitle("Vaultonix Trades", Vaultonix.FRONTEND_HOST);
      builder.setColor(Color.GREEN);
      builder.setDescription("Successfully created trade offer.");
      builder.addField("Message", "Created trade offer with " + partner_user.getName() + ". You can view it at " + Vaultonix.FRONTEND_HOST + "/vaultonix/trade/" + offer_response.id + ".", false);
      builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());
      event.replyEmbeds(builder.build()).queue();

      EmbedBuilder private_message_builder = new EmbedBuilder();
      private_message_builder.setTitle("Vaultonix Trades", Vaultonix.FRONTEND_HOST);
      private_message_builder.setColor(Color.GREEN);
      private_message_builder.setDescription("Invited to trade.");
      private_message_builder.addField("Message", user.getName() + " has created a trade offer for you. You can view it at " + Vaultonix.FRONTEND_HOST + "/vaultonix/trade/" + offer_response.id + ".", false);
      private_message_builder.setFooter("Thanks for using Vaultonix", event.getJDA().getSelfUser().getAvatarUrl());
      partner_user.openPrivateChannel()
        .flatMap(channel -> channel.sendMessageEmbeds(private_message_builder.build()))
        .queue();
    } catch (IOException ex) {
      System.out.println(ex);
      event.reply("Failed to execute command.");
      return;
    }
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
