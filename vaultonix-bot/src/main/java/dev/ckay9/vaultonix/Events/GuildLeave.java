package dev.ckay9.vaultonix.Events;

import org.apache.http.Header;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;

import dev.ckay9.vaultonix.HTTP;
import dev.ckay9.vaultonix.Vaultonix;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.events.guild.GuildLeaveEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class GuildLeave extends ListenerAdapter {
    @Override
    public void onGuildLeave(GuildLeaveEvent event) {
        Guild guild = event.getGuild();

        CloseableHttpResponse delete_response = HTTP.deleteRequest(Vaultonix.API_HOST + "/bot/guild?guild_id=" + guild.getId(), new Header[]{
            new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
        });
        if (delete_response == null) {
            return;
        }
    }
}
