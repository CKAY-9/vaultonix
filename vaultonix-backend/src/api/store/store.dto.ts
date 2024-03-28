export interface NewStoreItemDTO {
  credit_price: number;
  money_price: number;
  name: string;
  item_id: string;
  thumbnail: string;
  description: string;
  stock: number;
  sold: number;
  sale: number;
  premium: boolean;
}

export interface GetStoreItemDTO {
  item_id: number
}

export interface BuyItemDTO {
  item_id: number;
  user_id: string;
  guild_id: string;
  credits: boolean;
}