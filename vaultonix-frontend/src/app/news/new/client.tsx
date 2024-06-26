"use client"

import { createNewsArticle } from "@/api/news/news.api";
import { UserDTO, UserStaffDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Link from "next/link";
import { BaseSyntheticEvent, useState } from "react";

const NewArticleClient = (props: { user: UserDTO; staff: UserStaffDTO }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const create = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const article = await createNewsArticle(title, body, props.user.id);
    if (article !== null) {
      window.location.href = `/news/${article.id}`
    }
  }

  return (
    <>
      <Header user={props.user} />
      <main className="container">
        <div className="grid" style={{ gridTemplateColumns: "60% auto" }}>
          <div className="item">
            <h1>New Article</h1>
            <span>Here you can post new articles for Vaultonix News.</span>
          </div>
          <div className="item">
            <h2>Guildlines</h2>
            <ul style={{ margin: "0", listStyle: "numeric" }}>
              <li>
                Limit the use of inappropriate language (censor with **** if you
                can)
              </li>
              <li>
                Limit the use of personal pronouns (i.e. &apos;I&apos;,
                &apos;My&apos;, &apos;Personally&apos;, etc.)
              </li>
              <li>Be straight forward and to the point</li>
            </ul>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            <input type="text" name="title" placeholder="Title" onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} />
            <textarea
              name="body"
              cols={30}
              rows={15}
              placeholder="Body"
              onChange={(e: BaseSyntheticEvent) => setBody(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "70% auto" }}>
          <div className="item">
            <h2>Details</h2>
            <span>Posted {new Date().toLocaleDateString()}</span>
            <span>
              By {props.user.username}, {props.staff.tag}
            </span>
          </div>
          <div className="item">
            <button onClick={create}>Post</button>
            <Link
              href="/news"
              style={{
                backgroundColor: "var(--primary-700)",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NewArticleClient;
