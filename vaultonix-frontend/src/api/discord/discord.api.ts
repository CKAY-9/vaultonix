import axios, { AxiosResponse } from "axios";
import { GuildChannelDTO, GuildDTO, GuildRoleDTO, GuildSettingsDTO } from "./discord.dto";
import { API_URL, DISCORD_API } from "../resources";

// Vaultonix API
export const getGuildConfig = async (
  guild_id: string
): Promise<GuildSettingsDTO | null> => {
  try {
    const request: AxiosResponse<GuildSettingsDTO> = await axios({
      url: API_URL + "/guild/config",
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

export const getVaultonixActiveGuilds = async (guilds: GuildDTO[]) => {
  const guildsWithVaultonix = [];
  for (let i = 0; i < guilds.length; i++) {
    const g = guilds[i];
    try {
      const request = await axios({
        url: API_URL + "/guild/registered",
        method: "GET",
        params: {
          guild_id: g.id,
        },
      });
      if (request.status === 200) {
        guildsWithVaultonix.push(g);
      }
    } catch (ex) {}
  }
  return guildsWithVaultonix;
};

export const getGuildRolesFromVaultonix = async (
  guild_id: string
): Promise<GuildRoleDTO[]> => {
  if (typeof window === undefined) return [];
  try {
    const request: AxiosResponse<GuildRoleDTO[]> = await axios({
      url: API_URL + `/discord/guild_roles`,
      method: "GET",
      params: {
        guild_id: guild_id,
      },
    });
    return request.data || [];
  } catch (ex) {
    return [];
  }
};

export const getGuildChannelsFromVaultonix = async (
	guild_id: string
): Promise<GuildChannelDTO[]> => {
  if (typeof window === undefined) return [];
  try {
    const request: AxiosResponse<GuildChannelDTO[]> = await axios({
      url: API_URL + `/discord/guild_channels`,
      method: "GET",
      params: {
        guild_id: guild_id,
      },
    });
    return request.data || [];
  } catch (ex) {
    return [];
  }
};

// Discord API
export const getMyGuilds = async (): Promise<GuildDTO[]> => {
  if (typeof window === undefined || typeof document === undefined) {
    return [];
  }
  try {
    const request = await axios({
      url: DISCORD_API + "/users/@me/guilds",
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          window.sessionStorage.getItem("discord_token") || ""
        }`,
      },
    });
    return request.data || [];
  } catch (ex) {
    return [];
  }
};

export const getGuildRolesFromDiscord = async (
  guild_id: string
): Promise<GuildRoleDTO[]> => {
  if (typeof window === undefined) return [];
  try {
    const request: AxiosResponse<GuildRoleDTO[]> = await axios({
      url: DISCORD_API + `/guilds/${guild_id}/roles`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          "discord_token"
        )}`,
      },
    });
    return request.data || [];
  } catch (ex) {
    return [];
  }
};
