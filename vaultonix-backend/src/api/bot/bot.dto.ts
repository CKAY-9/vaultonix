export interface NewServerDTO {
  guild_id: string;
  guild_owner: string;
  guild_name: string;
}

export interface GetGuildDTO {
  guild_id: string;
}

export interface UpdateXPDTO {
  guild_id: string;
  user_id: string;
  xp_change: number;
}
