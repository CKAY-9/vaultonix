import { GuildLevelRewards, GuildUsers } from '@prisma/client';
import { prisma } from '../prisma';
import { getLevelRewards, initializeServerData } from '../guild/guild.utils';

export const initializeGuildUser = async (
  guild_id: string,
  user_id: string,
): Promise<GuildUsers> => {
  const check = await prisma.guildUsers.findFirst({
    where: {
      guild_id,
      user_id,
    },
  });
  if (check !== null) {
    return check;
  }

  let config = await prisma.guildSettings.findFirst({
    where: {
      guild_id,
    },
  });
  if (config === null) {
    config = (await initializeServerData(guild_id)).config;
  }

  let insert = await prisma.guildUsers.create({
    data: {
      guild_id,
      user_id,
      credits: config.starting_credits || 0,
      inventory: '[]',
    },
  });
  return insert;
};

export const calculateLevelCost = (current_level: number) => {
  return 100 * Math.pow(current_level, 5 / 4);
};

export const addXPToUser = async (user: GuildUsers, xp_change: number) => {
  const new_xp = user.xp + xp_change;
  if (new_xp >= calculateLevelCost(user.level)) {
    const level_rewards = await getLevelRewards(user.guild_id);
    let credits_reward = 0;
    const json: {
      selected_roles: string[];
      id: number;
      level: number;
      credits: number;
    }[] = JSON.parse(level_rewards.level_json);
    for (let j = 0; j < json.length; j++) {
      const temp_reward = json[j];
      if (temp_reward.level !== user.level + 1) {
        continue;
      }
      credits_reward = temp_reward.credits;
      break;
    }
    const update = await prisma.guildUsers.update({
      where: {
        guild_id: user.guild_id,
        user_id: user.user_id,
        id: user.id,
      },
      data: {
        xp: new_xp - calculateLevelCost(user.level),
        level: user.level + 1,
        credits: user.credits + credits_reward,
      },
    });
    return update;
  }

  const update = await prisma.guildUsers.update({
    where: {
      guild_id: user.guild_id,
      user_id: user.user_id,
      id: user.id,
    },
    data: {
      xp: new_xp,
    },
  });
  return update;
};
