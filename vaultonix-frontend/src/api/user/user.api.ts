import axios, { AxiosResponse } from "axios";
import { API_URL } from "../resources";
import { DiscordUserDTO, GuildMemberDTO, GuildUserDTO, UserDTO } from "./user.dto";

export const getUserFromToken = async (token: string | null | undefined): Promise<UserDTO | null> => {
  if (token === null || token === undefined) {
    return null;
  }
  try {
    const request = await axios({
      url: API_URL + "/user",
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const getUserFromGuild = async (guild_id: string, user_id: string): Promise<GuildUserDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/user/guild",
      method: "GET",
      params: {
        guild_id,
        user_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const getUserFromVaultonix = async (user_id: string, guild_id: string): Promise<GuildMemberDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/user/discord",
      method: "GET",
      params: {
        user_id,
        guild_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const getUserFromID = async (user_id: number): Promise<UserDTO | null> => {
  try {
    const request: AxiosResponse<UserDTO> = await axios({
      url: API_URL + "/user/public",
      method: "GET",
      params: {
        user_id: user_id,
      },
    });
    return request.data;
  } catch (ex) {
    return null;
  }
};

export const getUserStaff = async (user_id: number) => {
	try {
		const request = await axios({
			"url": API_URL + "/user/staff",
			"method": "GET",
			"params": {
				"user_id": user_id
			}
		});
		return request.data;
	} catch (ex) {
		return null;
	}
};
