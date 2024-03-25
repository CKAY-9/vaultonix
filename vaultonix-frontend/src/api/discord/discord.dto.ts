export interface GuildDTO {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  approximate_member_count: number;
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
