export interface DiscordCodeDTO {
  code: string;
}

export interface DiscordInitialDTO {
  access_token: string;
  token_type: string;
}

export interface DiscordUserDTO {
  id: string;
  global_name: string;
  avatar: string;
}

export interface GetUserDTO {
  user_id: number;
}

export interface GetGuildUserDTO {
  user_id: string;
  guild_id: string;
}