import axios from "axios";
import { API_URL } from "../resources";

export const updateAutoRolesForGuild = async (guild_id: string, role_ids: string[]): Promise<boolean> => {
  try {
    const request = await axios({
      "url": API_URL + "/guild/auto_roles",
      "method": "PUT",
      "data": {
        "role_ids": role_ids,
        "guild_id": guild_id
      }
    });
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}