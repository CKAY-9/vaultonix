export interface NewsArticleDTO {
  id: number;
  title: string;
  body: string;
  author_id: number;
  posted: Date;
  updated: Date;
}