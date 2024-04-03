import axios from "axios";
import { API_URL } from "../resources";
import {
  GuildLoggingDTO,
  LevelRewardsDTO,
  TradeDTO,
  TriviaDTO,
  WelcomeGoodbyeDTO,
} from "./vaultonix.dto";
import { GuildUserDTO } from "../user/user.dto";

export const updateAutoRolesForGuild = async (
  guild_id: string,
  role_ids: string[]
): Promise<boolean> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/auto_roles",
      method: "PUT",
      data: {
        role_ids: role_ids,
        guild_id: guild_id,
      },
    });
    return true;
  } catch (ex) {
    return false;
  }
};

export const getGuildUsers = async (
  guild_id: string
): Promise<GuildUserDTO[]> => {
  try {
    const response = await axios({
      url: API_URL + "/guild/users",
      method: "GET",
      params: {
        guild_id,
      },
    });
    return response.data;
  } catch (ex) {
    return [];
  }
};

export const getWelcomeGoodbyeForGuild = async (
  guild_id: string
): Promise<WelcomeGoodbyeDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/welcome_goodbye",
      method: "GET",
      params: {
        guild_id: guild_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const getTradeFromID = async (
  trade_id: number,
): Promise<TradeDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/trade",
      method: "GET",
      params: {
        trade_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const updateWelcomeGoodbyeForGuild = async (
  guild_id: string,
  channel_id: string,
  welcome: string,
  goodbye: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/welcome_goodbye",
      method: "PUT",
      data: {
        guild_id,
        channel_id,
        welcome,
        goodbye,
        enabled,
      },
    });
    return true;
  } catch (ex) {
    return false;
  }
};

export const getLevelRewards = async (
  guild_id: string
): Promise<LevelRewardsDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/levels",
      method: "GET",
      params: {
        guild_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const updateLevelRewards = async (
  guild_id: string,
  level_rewards: LevelRewardsDTO
): Promise<LevelRewardsDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/levels",
      method: "PUT",
      data: {
        level_rewards,
        guild_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const getTrivia = async (
  guild_id: string
): Promise<TriviaDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/trivia",
      method: "GET",
      params: {
        guild_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const updateTriviaQuestions = async (
  guild_id: string,
  trivia: TriviaDTO
): Promise<boolean> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/trivia",
      method: "PUT",
      data: {
        guild_id,
        trivia
      }
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export const getGuildLogging = async (
  guild_id: string
): Promise<GuildLoggingDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/logging",
      method: "GET",
      params: {
        guild_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const updateGuildLogging = async (
  logging: GuildLoggingDTO
): Promise<boolean> => {
  try {
    const request = await axios({
      url: API_URL + "/guild/logging",
      method: "PUT",
      data: {
        logging
      }
    });
    return true;
  } catch (ex) {
    return false;
  }
}