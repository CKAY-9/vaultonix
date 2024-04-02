export interface NewTradeDTO {
  user_id: string;
  partner_id: string;
  guild_id: string;
}

export interface GetTradeDTO {
  trade_id: number;
}