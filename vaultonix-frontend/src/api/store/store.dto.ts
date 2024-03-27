export interface ItemStoreDTO {
  id: number;
  global_sale: number;
  total_credits_spent: number;
  total_money_spent: number;
  total_transactions: number;
}

export interface StoreEntryDTO {
  id: number;
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