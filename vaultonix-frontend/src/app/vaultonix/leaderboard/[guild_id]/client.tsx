"use client";

import { getGuildFromVaultonix, getUserFromDiscord } from "@/api/discord/discord.api";
import { VaultonixGuildDTO } from "@/api/discord/discord.dto";
import { getUserFromID, getUserFromToken, getUserFromVaultonix } from "@/api/user/user.api";
import { DiscordUserDTO, GuildMemberDTO, GuildUserDTO, UserDTO } from "@/api/user/user.dto";
import { getGuildUsers } from "@/api/vaultonix/vaultonix.api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";
import style from "./leaderboard.module.scss";
import { calculateLevelCost } from "@/api/user/user.utils";
import Image from "next/image";
import { DISCORD_CDN } from "@/api/resources";

const User = (props: { guild_user: GuildUserDTO }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<GuildMemberDTO | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getUserFromVaultonix(props.guild_user.user_id, props.guild_user.guild_id);
      setUser(u);
      setLoading(false);
    })();
  }, [props.guild_user.user_id, props.guild_user.guild_id]);

  if (loading || user === null) {
    return (
      <div className={style.guild_user}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      <div className={style.guild_user}>
        <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
          <Image 
            src={DISCORD_CDN + "/avatars/" + user.user.id + "/" + user.user.avatar}
            alt="PFP"
            sizes="100%"
            width={0}
            height={0}
            className={style.pfp}
          />
          <h3>{user.user.global_name}</h3>
        </section>
        <span>Credits: {props.guild_user.credits}</span>
        <span>Level {props.guild_user.level} ({Math.round(props.guild_user.xp / Math.round(calculateLevelCost(props.guild_user.level)) * 100)}% towards Level {props.guild_user.level + 1})</span>
        <div className={style.xp}>
          <div
            className={style.progress}
            style={{
              width: `${(props.guild_user.xp / calculateLevelCost(props.guild_user.level)) * 100}%`,
            }}
          ></div>
          <div className={style.xp_progress}>
            {props.guild_user.xp} / {Math.round(calculateLevelCost(props.guild_user.level))}
          </div>
        </div>
      </div>
    </>
  );
};

const LeaderboardClient = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [guild, setGuild] = useState<VaultonixGuildDTO | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guild_users, setGuildUsers] = useState<GuildUserDTO[]>([]);

  useEffect(() => {
    (async () => {
      const g = await getGuildFromVaultonix(props.guild_id);
      const g_users = await getGuildUsers(props.guild_id);
      setGuild(g);
      setGuildUsers(g_users);
      setLoading(false);

      if (typeof document === undefined || typeof window === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) return;

      const u = await getUserFromToken(user_token);
      setUser(u);
    })();
  }, [props.guild_id]);

  if (loading || guild === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid">
          <div className="item">
            <h1>{guild.guild_name}&apos;s Leaderboard</h1>
            <span>
              View {guild.guild_name}&apos;s statistics and members. See who has
              the most XP and Credits, or who has the least...
            </span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            {guild_users
              .sort((a, b) => {
                return a.level > b.level ? -1 : 1;
              })
              .map((user, index) => {
                return <User guild_user={user} key={index} />;
              })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LeaderboardClient;
