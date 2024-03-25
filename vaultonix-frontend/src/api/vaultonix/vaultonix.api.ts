import axios from "axios";
import { API_URL } from "../resources";
import { WelcomeGoodbyeDTO } from "./vaultonix.dto";

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

export const updateWelcomeGoodbyeForGuild = async (
  guild_id: string,
  channel_id: string,
  welcome: string,
  goodbye: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    const request = await axios({
      "url": API_URL + "/guild/welcome_goodbye",
      "method": "PUT",
      "data": {
        guild_id,
        channel_id,
        welcome,
        goodbye,
        enabled
      }
    });
    return true;
  } catch (ex) {
    return false;
  }
};
