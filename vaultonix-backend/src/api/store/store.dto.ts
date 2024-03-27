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