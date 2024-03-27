"use client"

import { getAllNewsArticles } from "@/api/news/news.api";
import { NewsArticleDTO } from "@/api/news/news.dto";
import ArticlePreview from "@/components/article-preview/article-preview";
import Link from "next/link";
import { useEffect, useState } from "react";

const NewsClient = () => {
  const [articles, setArticles] = useState<NewsArticleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let as = await getAllNewsArticles();
      as = as.reverse();
      setArticles(as);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <>
        <div className="grid">
          <div className="item">
            <h3>Loading...</h3>
          </div>
        </div>    
      </>
    );
  }
  
  return (
    <>
      {articles.map((article: NewsArticleDTO, index: number) => {
        return (
          <Link href={`/news/${article.id}`}>
            <ArticlePreview article={article} />
          </Link>
        );
      })}
    </>
  );
}

export default NewsClient;