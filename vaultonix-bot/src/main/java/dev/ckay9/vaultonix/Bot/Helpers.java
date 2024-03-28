package dev.ckay9.vaultonix.Bot;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.jetbrains.annotations.Nullable;

import com.google.gson.Gson;

import dev.ckay9.vaultonix.Vaultonix;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;

public class Helpers {
  public static GuildUser getUser(String guild_id, String user_id) {
    try {
      CloseableHttpResponse user_response = HTTP
        .getRequest(Vaultonix.API_HOST + "/user/guild?guild_id=" + guild_id + "&user_id=" + user_id,
          new Header[] {
            new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
          });
      Gson gson = new Gson();
      HttpEntity user_entity = user_response.getEntity();
      GuildUser initial_user = gson.fromJson(EntityUtils.toString(user_entity, "UTF-8"), GuildUser.class);
      return initial_user;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }

  public static LevelReward[] parseLevelRewards(LevelRewards rewards) {
    Gson gson = new Gson();
    LevelReward[] level_rewards = gson.fromJson(rewards.level_json, LevelReward[].class);
    return level_rewards;
  }

  public static LevelRewards getLevelRewards(String guild_id) {
    try {
      CloseableHttpResponse response = HTTP.getRequest(Vaultonix.API_HOST + "/guild/levels?guild_id=" + guild_id, new Header[]{
        new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
      });
      HttpEntity entity = response.getEntity();
      Gson gson = new Gson();
      LevelRewards rewards = gson.fromJson(EntityUtils.toString(entity, "UTF-8"), LevelRewards.class);
      return rewards;
    } catch (IOException ex) {
      System.out.println(ex.toString());
      return null;
    }
  }

  public static void onLevelUp(Member guild_member, Guild guild, int new_level, @Nullable TextChannel channel) {
    LevelRewards rewards = getLevelRewards(guild.getId());
    if (rewards == null) return;

    LevelReward[] level_rewards = parseLevelRewards(rewards);
    if (level_rewards == null) return;
    
    for (int i = 0; i < level_rewards.length; i++) {
      LevelReward temp = level_rewards[i];
      if (temp.level != new_level) continue;

      if (temp.selected_roles != null && temp.selected_roles.length >= 1) {
        for (int j = 0; j < temp.selected_roles.length; j++) {
          Role role = guild.getRoleById(temp.selected_roles[j]);
          guild.addRoleToMember(guild_member, role).queue();
        }
      }
    }

    if (channel != null) {
      channel.sendMessage("Congrats <@" + guild.getId() + ">, you reached Level " + new_level + "!").queue();
    }
  }

  public static GuildUser addXP(String guild_id, String user_id, int xp_change) {
    HTTP.putRequest(Vaultonix.API_HOST + "/bot/xp", new Header[] {
      new BasicHeader("Authorization", Vaultonix.BOT_AUTH_KEY)
    }, new UpdateXP(guild_id, 10, user_id));

    GuildUser user = getUser(guild_id, user_id);
    return user;
  }
}
