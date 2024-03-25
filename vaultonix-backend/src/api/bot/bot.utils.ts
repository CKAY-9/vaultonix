import { GuildWelcomeGoodbye } from "@prisma/client";
import { prisma } from "../prisma"

export interface ServerDataReturn {
  config: any,
}

export const initialServerData = async (guild_id: string): Promise<ServerDataReturn> => {
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

export const initialWelcomeGoodbye = async (guild_id: string): Promise<GuildWelcomeGoodbye> => {
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