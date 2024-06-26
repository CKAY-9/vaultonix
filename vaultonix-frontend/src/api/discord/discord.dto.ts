export interface GuildDTO {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  approximate_member_count: number;
}

export interface VaultonixGuildDTO {
  id: number;
  guild_name: string;
  guild_owner: string;
  guild_id: string;
}

export interface GuildSettingsDTO {
  id: number;
  guild_id: string;
  global_stats: boolean;
  starting_credits: number;
  join_roles: string[];
}

export interface GuildRoleDTO {
  id: string;
  name: string;
  color: number;
  icon?: string;
  permissions: string;
}

export interface GuildChannelDTO {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
}