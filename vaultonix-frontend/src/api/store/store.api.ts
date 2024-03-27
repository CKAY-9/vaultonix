import axios from "axios";
import { ItemStoreDTO, StoreEntryDTO } from "./store.dto";
import { API_URL } from "../resources";

export const getStoreData = async (): Promise<ItemStoreDTO> => {
  const request = await axios({
    url: API_URL + "/store",
    method: "GET",
  });
  return request.data;
};

export const getStoreItems = async (): Promise<StoreEntryDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/store/items",
      method: "GET",
    });
    return request.data;
  } catch (ex) {
    return [];
  }
};

export const getStoreItem = async (item_id: number): Promise<StoreEntryDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/store/item",
      method: "GET",
      params: {
        item_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const createStoreItem = async (
  credit_price: number,
  money_price: number,
  name: string,
  item_id: string,
  thumbnail: string,
  description: string,
  stock: number,
  sale: number,
  premium: boolean
): Promise<StoreEntryDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/store/items",
      method: "POST",
      data: {
        credit_price,
        money_price,
        name,
        item_id,
        thumbnail,
        description,
        stock,
        sale,
        premium,
      },
    });
    return request.data;
  } catch (ex) {
    return [];
  }
};
