package dev.ckay9.vaultonix;

import dev.ckay9.vaultonix.Events.GuildJoin;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.utils.cache.CacheFlag;

public class Vaultonix {
    public static String API_HOST = "http://127.0.0.1:3001/api/v1";
    public static String BOT_AUTH_KEY = "";

    public static void main(String[] args) {
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
        JDABuilder builder = JDABuilder.createDefault(args[0]);
        if (args[1] != null) {
            Vaultonix.API_HOST = args[1] + "/api/v1";
        }
        Vaultonix.BOT_AUTH_KEY = args[2];

        builder.disableCache(CacheFlag.MEMBER_OVERRIDES, CacheFlag.VOICE_STATE);
        builder.setBulkDeleteSplittingEnabled(false);

        builder.addEventListeners(new GuildJoin());

        builder.setActivity(Activity.listening("TO KENETH CARSON"));

        builder.build();
    }
}