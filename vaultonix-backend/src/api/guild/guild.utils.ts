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
  return level_rewards;
}

export const getGuildTriviaWithID = async (guild_id: string) => {
  const trivia = await prisma.guildTrivia.findFirst({
    where: {
      guild_id
    }
  });
  return trivia;
}

export const initializeTrivia = async (guild_id: string) => {
  const check = await prisma.guildTrivia.findFirst({
    where: {
      guild_id
    }
  });
  if (check !== null) {
    return check;
  }

  const insert = await prisma.guildTrivia.create({
    data: {
      guild_id
    }
  });
  return insert;
}