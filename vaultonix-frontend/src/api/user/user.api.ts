import axios from "axios";
import { API_URL } from "../resources";

export const getUserFromToken = async (token: string | null | undefined) => {
    if (token === null || token === undefined) {
        return null;
    }
    try {
        const request = await axios({
            "url": API_URL + "/user",
            "method": "GET",
            "headers": {
                "Authorization": token
            }
        });
        return request.data;
    } catch (ex) {
        return null;
    }
}