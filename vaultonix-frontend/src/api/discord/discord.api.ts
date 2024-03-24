import axios, { AxiosResponse } from "axios";
import { GuildDTO } from "./discord.dto";
import { API_URL, DISCORD_API } from "../resources";

export const getGuildFromID = async (guild_id: string): Promise<GuildDTO | null> => {
    if (typeof(window) === undefined) return null;
    try {
        const request: AxiosResponse<GuildDTO> = await axios({
            "url": DISCORD_API + `/guilds/${guild_id}`,
            "method": "GET",
            "headers": {
                "Authorization": `Bearer ${window.sessionStorage.getItem("discord_token")}`
            }
        });
        return request.data;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}

export const getMyGuilds = async (): Promise<GuildDTO[]> => {
    if (typeof(window) === undefined) return [];
    try {
        const request: AxiosResponse<GuildDTO[]> = await axios({
            url: DISCORD_API + "/users/@me/guilds",
            "method": "GET",
            "headers": {
                "Authorization": `Bearer ${window.sessionStorage.getItem("discord_token")}`
            }
        });
        return request.data || [];
    } catch (ex) {
        return [];
    }
}

export const getVaultonixActiveGuilds = async (guilds: GuildDTO[]) => {
    const guildsWithVaultonix = [];
    for (let i = 0; i < guilds.length; i++) {
        const g = guilds[i];
        try {
            const request = await axios({
                "url": API_URL + "/guild/registered",
                "method": "GET",
                "params": {
                    "guild_id": g.id
                }
            });
            if (request.status === 200) {
                guildsWithVaultonix.push(g);
            }
        } catch (ex) {
            
        }
    }
    return guildsWithVaultonix;
}