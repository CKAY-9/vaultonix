package dev.ckay9.vaultonix;

import dev.ckay9.vaultonix.Commands.BotCommands;
import dev.ckay9.vaultonix.Commands.CommandHandler;
import dev.ckay9.vaultonix.Events.BotReady;
import dev.ckay9.vaultonix.Events.GuildJoin;
import dev.ckay9.vaultonix.Events.MemberJoin;
import dev.ckay9.vaultonix.Events.MemberLeave;
import dev.ckay9.vaultonix.Events.MessageReceived;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.utils.cache.CacheFlag;

public class Vaultonix {
  public static String API_HOST = "http://127.0.0.1:3001/api/v1";
  public static String FRONTEND_HOST = "http://127.0.0.1:3000";
  public static String BOT_AUTH_KEY = "";

  public static int calculateLevelCost(int current_level) {
    return (int) (100 * Math.floor(Math.pow(current_level, 5 / 4)));
  }

  public static void main(String[] args) {
    try {
      if (args.length == 0) {
        System.out.println("NO BOT TOKEN PROVIDED.");
        return;
      }
      if (args.length == 1) {
        System.out.println("NO API HOST PROVIDED. USING DEFAULT: " + API_HOST);
      }
      if (args.length == 2) {
        System.out.println("NO BOT AUTH KEY PROVIDED.");
        return;
      }
      if (args.length == 3) {
        System.out.println("NO FRONTEND HOST PROVIDED. USING DEFAULT: " + FRONTEND_HOST);
      }
      JDABuilder builder = JDABuilder.createDefault(args[0]);
      if (args[1] != null) {
        Vaultonix.API_HOST = args[1] + "/api/v1";
      }
      Vaultonix.BOT_AUTH_KEY = args[2];
      if (args[3] != null) {
        Vaultonix.FRONTEND_HOST = args[3];
      }

      builder.disableCache(CacheFlag.VOICE_STATE);
      builder.setBulkDeleteSplittingEnabled(false);
      builder.enableIntents(
        GatewayIntent.GUILD_MEMBERS,
        GatewayIntent.GUILD_MESSAGES,
        GatewayIntent.GUILD_MODERATION
      );
      builder.addEventListeners(
        new GuildJoin(),
        new MemberJoin(),
        new MemberLeave(),
        new MessageReceived(),
        new BotReady(),
        new CommandHandler()
      );
      builder.setActivity(Activity.watching("over you..."));
      JDA jda = builder.build().awaitReady();
      BotCommands.addGlobalCommands(jda);
    } catch (InterruptedException ex) {
      System.out.println(ex);
      return;
    }
  }
}