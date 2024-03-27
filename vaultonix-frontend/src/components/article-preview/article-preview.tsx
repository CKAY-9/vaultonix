"use client"

import { NewsArticleDTO } from "@/api/news/news.dto"
import style from "./article-preview.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/user/user.dto";
import { getUserFromID } from "@/api/user/user.api";

const ArticlePreview = (props: {
  article: NewsArticleDTO
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [author, setAuthor] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      const a = await getUserFromID(props.article.author_id);
      setAuthor(a);
      setLoading(false);
    })();
  }, [props.article.author_id]);

  if (loading || author === null) {
    return (
      <div className={style.article}>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className={style.article}>
      <h2>{props.article.title}</h2>
      <span>{props.article.body.slice(0, 100)}...</span>
      <section style={{"display": "flex", "gap": "1rem"}}>
        <span>Posted by <Link className={author.supporter ? "rainbow" : ""} style={{"fontWeight": author.supporter ? "700" : "400"}} href={`/vaultonix/user/${author.id}`}>{author.username}</Link></span>
        <span>Posted on {new Date(props.article.posted).toLocaleDateString()}</span>
      </section>
    </div>
  );
}

export default ArticlePreview;