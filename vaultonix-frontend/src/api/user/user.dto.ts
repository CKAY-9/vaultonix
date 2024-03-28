export interface UserDTO {
  id: number;
  discord_id: string;
  token: string;
  username: string;
  avatar_url: string;
  joined: Date;
  supporter: boolean;
}

export interface UserStaffDTO {
  id: number;
  user_id: number;
  permissions: number;
  tag: string;
}

export interface DiscordUserDTO {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
}

export interface GuildMemberDTO {
  user: DiscordUserDTO;
  nick?: string;
  avatar?: string;
  roles: string[];
}

export interface GuildUserDTO {
  id: number;
  guild_id: string;
  user_id: string;
  credits: number;
  level: number;
  xp: number;
  inventory: string;
}