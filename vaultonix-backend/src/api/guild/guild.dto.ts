import { GuildLevelRewards, GuildTrivia } from "@prisma/client";

export interface GuildIDDTO {
  guild_id: string;
}

export interface UpdateAutoRolesDTO {
  guild_id: string;
  role_ids: string[];
}

export interface UpdateWelcomeGoodbyeDTO {
  guild_id: string;
  channel_id: string;
  welcome: string;
  goodbye: string;
  enabled: boolean;
}

export interface UpdateLevelRewardsDTO {
  guild_id: string;
  level_rewards: GuildLevelRewards;
}

export interface UpdateTriviaQuestions {
  guild_id: string;
  trivia: GuildTrivia
}