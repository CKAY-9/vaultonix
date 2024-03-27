import { getNewsArticle } from "@/api/news/news.api";
import { Metadata } from "next";
import NewsArticleClient from "./client";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const article = await getNewsArticle(Number.parseInt(params.id));
  if (article === null) {
    return {
      title: "Article - Vaultonix",
      description: "View this article on Vaultonix News."
    }
  }

  return {
    title: `${article.title} - Vaultonix`,
    description: `View the article, ${article.title}, on Vaultonix News.`
  }
}

const NewsArticlePage = ({params}: {
  params: {
    id: string
  }
}) => {
  return (
    <>
      <NewsArticleClient article_id={Number.parseInt(params.id)} />
    </>
  );
}

export default NewsArticlePage;