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

export interface TradeDTO {
  id: number;
  user_id: string;
  partner_id: string;
  user_items: string[];
  partner_items: string[];
  user_confirmed: boolean;
  partner_confirmed: boolean;
  trade_complete: boolean;
  completed: Date;
  guild_id: string;
}
