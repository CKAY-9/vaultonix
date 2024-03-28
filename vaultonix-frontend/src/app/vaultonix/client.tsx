"use client";

import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";
import style from "./app.module.scss";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/header";
import { GuildDTO, VaultonixGuildDTO } from "@/api/discord/discord.dto";
import {
  getGuildFromVaultonix,
  getMyGuilds,
  getVaultonixActiveGuilds,
} from "@/api/discord/discord.api";
import Footer from "@/components/footer/footer";
import GuildSelector from "@/components/guild-selector/guild-selector";

const VaultonixClient = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);
  const [active_guilds, setActiveGuilds] = useState<GuildDTO[]>([]);
  const [selected_guild_id, setSelectedGuildID] = useState<string>("");
  const [loading_guild, setLoadingGuild] = useState<boolean>(false);
  const [current_guild, setCurrentGuild] = useState<VaultonixGuildDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined) {
        return;
      }
      if (typeof document === undefined) {
        return;
      }

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        window.location.href = "/vaultonix/login";
      }

      const u = await getUserFromToken(user_token as string);
      if (u === null) {
        window.location.href = "/vaultonix/login";
      }

      const gs = await getMyGuilds();
      const ags = await getVaultonixActiveGuilds(gs);

      setUser(u);
      setGuilds(gs);
      setActiveGuilds(ags);
      setLoadingUser(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingGuild(true);
      const g = await getGuildFromVaultonix(selected_guild_id);
      setCurrentGuild(g);
      setLoadingGuild(false);
    })();
  }, [selected_guild_id]);

  if (loadingUser || user === null) {
    return <Loading />;
  }

  return (
    <>
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          width: "10rem",
          height: "auto",
          position: "fixed",
          top: "10vh",
          left: "2vw",
          transform: "rotate(-10deg)",
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          width: "10rem",
          height: "auto",
          position: "fixed",
          top: "75vh",
          left: "2vw",
          transform: "rotate(15deg)",
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          width: "10rem",
          height: "auto",
          position: "fixed",
          top: "20vh",
          left: "88vw",
          transform: "rotate(15deg)",
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          width: "10rem",
          height: "auto",
          position: "fixed",
          top: "80vh",
          left: "88vw",
          transform: "rotate(-5deg)",
        }}
      />
      <Header user={user} />
      <main className="container">
        <Link href="/">Home</Link>
        <div className={style.grid} style={{ gridTemplateColumns: "70% auto" }}>
          <div className={style.item}>
            <Image
              src={user.avatar_url}
              alt="Discord PFP"
              sizes="100%"
              width={0}
              height={0}
              className={style.pfp}
            />
            <section
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <h1>Hello, {user.username}</h1>
              <Image
                src="/wave.svg"
                alt="Stats"
                sizes="100%"
                width={0}
                height={0}
                style={{ width: "3rem", height: "3rem", filter: "invert(1)" }}
              />
            </section>
          </div>
          <div className={style.item}>
            <section
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h2>Latest News</h2>
              <Image
                src="/news.svg"
                alt="Stats"
                sizes="100%"
                width={0}
                height={0}
                style={{ width: "2rem", height: "2rem", filter: "invert(1)" }}
              />
            </section>
            <div style={{ maxHeight: "100%", overflowY: "auto" }}>
              <Link href="/news">
                <div className={style.news}>Update v1.0 - Initial Release</div>
              </Link>
            </div>
          </div>
        </div>
        <div className={style.grid} style={{ gridTemplateColumns: "100%" }}>
          <div className={style.item} style={{ flexDirection: "row" }}>
            <Link href="/vaultonix/dashboard">Dashboard</Link>
            <Link href="/vaultonix/item-store">Item Store</Link>
            <Link href="/vaultonix/settings">Settings</Link>
          </div>
        </div>
        <div className={style.grid} style={{ gridTemplateColumns: "auto 75%" }}>
          <div className={style.item} style={{ gap: "0" }}>
            <section
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3>Statistics</h3>
              <Image
                src="/stats.svg"
                alt="Stats"
                sizes="100%"
                width={0}
                height={0}
                style={{ width: "2rem", height: "2rem", filter: "invert(1)" }}
              />
            </section>
            <section style={{ display: "flex", flexDirection: "column" }}>
              <span>Server Count: {guilds.length}</span>
              <span>Vaultonix-Active Servers: {active_guilds.length}</span>
              <span>Vaultonix Economy: $0</span>
            </section>
          </div>
          <div className={style.item}>
            <h3>Guild</h3>
            <GuildSelector
              on_guild_select={(guild_id: string) =>
                setSelectedGuildID(guild_id)
              }
            />
            {loading_guild ? (
              <span>Loading...</span>
            ) : (
              <>
                {current_guild !== null && (
                  <>
                    <section>
                      <Link href={`/vaultonix/leaderboard/${current_guild.guild_id}`}>Leaderboard</Link>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VaultonixClient;
