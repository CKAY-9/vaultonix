package dev.ckay9.vaultonix.Events;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.HTTP;
import dev.ckay9.vaultonix.Vaultonix;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

class ConfigResponse {
    public String[] join_roles;
}

public class MemberJoin extends ListenerAdapter {
    @Override
    public void onGuildMemberJoin(GuildMemberJoinEvent event) {
        try {
            CloseableHttpResponse response = HTTP.getRequest(Vaultonix.API_HOST + "/guild/config", new Header[]{
                new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
            });
            Gson gson = new Gson();
            HttpEntity entity = response.getEntity();
            ConfigResponse parsed = gson.fromJson(EntityUtils.toString(entity, "UTF-8"), ConfigResponse.class);
        
            if (parsed.join_roles.length <= 0) return;

            Guild guild = event.getGuild();
            User user = event.getUser();
            
            for (int i = 0; i < parsed.join_roles.length; i++) {
                Role role = guild.getRoleById(parsed.join_roles[i]);
                guild.addRoleToMember(user, role);
            }
        } catch (IOException ex) {
            System.out.println(ex.toString());
        }
    }
}
