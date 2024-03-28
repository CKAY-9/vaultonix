export interface WelcomeGoodbyeDTO {
  channel_id: string;
  enabled: boolean;
  goodbye: string;
  welcome: string;
  guild_id: string;
}

export interface LevelRewardsDTO {
  id: number;
  enabled: boolean;
  guild_id: string;
  level_json: string;
}

export interface LevelDTO {
  level: number;
  selected_roles: string[];
  credits: number;
}

export interface TriviaDTO {
  id: number;
  questions: string;
  enabled: string;
  guild_id: string;
}

export interface TriviaQuestionDTO {
  prompt: string;
  answers: string[];
  correct_answer: number;
  credits_reward: number;
}