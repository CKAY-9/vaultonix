import { DISCORD_CDN } from "../resources"

export const guildIconToURL = (guild_id: string, guild_icon_hash: string) => {
    return `${DISCORD_CDN}/icons/${guild_id}/${guild_icon_hash}`;
}