"use client"

import { getNewsArticle } from "@/api/news/news.api";
import { NewsArticleDTO } from "@/api/news/news.dto";
import { getUserFromID, getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import UserChip from "@/components/user-chip/user-chip";
import { getCookie } from "@/utils/cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

const NewsArticleClient = (props: {
  article_id: number
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [article, setArticle] = useState<NewsArticleDTO | null>(null);
  const [author, setAuthor] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      const a = await getNewsArticle(props.article_id);
      if (a === null) {
        window.location.href = "/news"
        return;
      }
      const au = await getUserFromID(a.author_id);
      setAuthor(au);
      setArticle(a);

      setLoading(false);
      if (typeof(window) === undefined || typeof(document) === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        return;
      }

      const u = await getUserFromToken(user_token);
      setUser(u);
    })();
  }, [props.article_id]);

  if (loading || article === null || author === null) {
    return (<Loading />);
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/news">News</Link>
        <div className="grid" style={{"gridTemplateColumns": "70% auto"}}>
          <div className="item">
            <h1>{article.title}</h1>
          </div>
          <div className="item">
            <h3>Details</h3>
            <span>Posted by <Link className={author.supporter ? "rainbow" : ""} style={{"fontWeight": author.supporter ? "700" : "400"}} href={`/vaultonix/user/${author.id}`}>{author.username}</Link></span>
            <span>Posted on {new Date(article.posted).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            <p>
              {article.body}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NewsArticleClient;