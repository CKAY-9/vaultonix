package dev.ckay9.vaultonix.Commands;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.commands.build.Commands;

public class BotCommands {
  public static void addGlobalCommands(JDA jda) {
    jda.updateCommands().addCommands(
      Commands.slash("leaderboard", "See the leaderboard for this guild."),
      Commands.slash("about", "Learn about Vaultonix."),
      Commands.slash("inventory", "View your inventory for this guild."),
      Commands.slash("trade", "Trade with other users. Must be enabled by the guild owner.")
        .addOption(OptionType.MENTIONABLE, "trade_partner", "Person you want to trade with.", true)
    ).queue();
  }
}
