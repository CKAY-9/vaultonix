import axios, { AxiosResponse } from "axios";
import { API_URL } from "../resources";
import { UserDTO } from "./user.dto";

export const getUserFromToken = async (token: string | null | undefined) => {
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

export const getUserFromID = async (user_id: number) => {
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
