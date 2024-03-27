import axios from "axios";
import { NewsArticleDTO } from "./news.dto";
import { API_URL } from "../resources";

export const getNewsArticle = async (article_id: number): Promise<NewsArticleDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/news",
      method: "GET",
      params: {
        article_id
      }
    });
    return request.data;
  } catch (ex) {
    return null;
  }
}

export const getAllNewsArticles = async (): Promise<NewsArticleDTO[]> => {
  try {
    const request = await axios({
      url: API_URL + "/news/all",
      method: "GET"
    });
    return request.data;
  } catch (ex) {
    return [];
  }
}

export const createNewsArticle = async (title: string, body: string, author_id: number): Promise<NewsArticleDTO | null> => {
  try {
    const request = await axios({
      url: API_URL + "/news",
      method: "POST",
      data: {
        title,
        body,
        author_id
      }
    });
    return request.data
  } catch (ex) {
    return null;
  }
}