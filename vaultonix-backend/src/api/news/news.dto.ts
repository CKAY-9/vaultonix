export interface NewNewsArticleDTO {
  title: string;
  body: string;
  author_id: number;
}

export interface GetNewsArticleDTO {
  article_id: number
}