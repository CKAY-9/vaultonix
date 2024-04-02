import { GuildLevelRewards, GuildWelcomeGoodbye } from "@prisma/client";
import { prisma } from "../prisma";

export interface ServerDataReturn {
  config: any,
}

export const initializeServerData = async (guild_id: string): Promise<ServerDataReturn> => {
  try {
    const check = await prisma.guildSettings.findFirst({
      where: {
        guild_id: guild_id
      }
    });
    if (check !== null) {
      return {
        config: check
      };
    }
    const c = await prisma.guildSettings.create({
      data: {
        "global_stats": false,
        "guild_id": guild_id,
        "join_roles": [],
        "starting_credits": 500
      }
    });
    return {
      config: c
    };
  } catch (ex) {
    console.log(ex)
    return {
      config: null
    }
  }
}

export const initializeWelcomeGoodbye = async (guild_id: string): Promise<GuildWelcomeGoodbye> => {
  const check = await prisma.guildWelcomeGoodbye.findFirst({
    where: {
      "guild_id": guild_id
    }
  });
  if (check !== null) {
    return check;
  }
  const create = await prisma.guildWelcomeGoodbye.create({
    data: {
      "channel_id": "",
      "enabled": true,
      "goodbye": "",
      "welcome": "",
      "guild_id": guild_id,
    }
  });
  return create;
}

export const initializeLevelRewards = async (guild_id: string): Promise<GuildLevelRewards> => {
  const check = await prisma.guildLevelRewards.findFirst({
    where: {
      "guild_id": guild_id
    }
  });
  if (check !== null) {
    return null;
  }

  const insert = await prisma.guildLevelRewards.create({
      data: {
        "enabled": true,
        "guild_id": guild_id,
        "level_json": "[]",
      }
  });
  return insert;
}

export const getLevelRewards = async (guild_id: string): Promise<GuildLevelRewards | null> => {
  const level_rewards = await prisma.guildLevelRewards.findFirst({
    where: {
      guild_id: guild_id
    }
  });
  if (level_rewards !== null) {
    return level_rewards;
  }
  const init = await initializeLevelRewards(guild_id);
  return init;
}

export const initializeTrivia = async (guild_id: string) => {
  const insert = await prisma.guildTrivia.create({
    data: {
      guild_id
    }
  });
  return insert;
}

export const initializeGuildLogging = async (
  guild_id: string
) => {
  const insert = await prisma.guildLogging.create({
    data: {
      guild_id,
    }
  });
  return insert;
}

export const getLogging = async (
  guild_id: string
) => {
  const check = await prisma.guildLogging.findFirst({
    where: {
      guild_id
    }
  });
  if (check !== null) {
    return check;
  }
  const init = await initializeGuildLogging(guild_id);
  return init;
}

export const getTrivia = async (
  guild_id: string
) => {
  const check = await prisma.guildTrivia.findFirst({
    where: {
      guild_id
    }
  });
  if (check !== null) {
    return check;
  }
  const init = await initializeTrivia(guild_id);
  return init;
}

export const getWelcomeGoodbye = async (
  guild_id: string
) => {
  const check = await prisma.guildWelcomeGoodbye.findFirst({
    where: {
      guild_id
    }
  });
  if (check !== null) {
    return check;
  }
  const init = await initializeWelcomeGoodbye(guild_id);
  return init;
}

export const getGuildSettings = async (
  guild_id: string
) => {
  const check = await prisma.guildSettings.findFirst({
    where: {
      guild_id
    }
  });
  if (check !== null) {
    return check;
  }
  const init = (await initializeServerData(guild_id)).config;
  return init;
}

export const getGuild = async (
  guild_id: string
) => {
  const guild = await prisma.guilds.findFirst({
    where: {
      guild_id: guild_id || '',
    },
  });
  if (guild === null) {
    return null;
  }
  const config = await prisma.guildSettings.findFirst({
    where: {
      guild_id: guild_id,
    },
  });
  if (config === null) {
    await initializeServerData(guild_id);
  }
  return guild;
}