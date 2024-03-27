"use client";

import {
  getMyGuilds,
  getVaultonixActiveGuilds,
} from "@/api/discord/discord.api";
import { GuildDTO } from "@/api/discord/discord.dto";
import { DISCORD_INVITE } from "@/api/resources";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import GuildPreview from "@/components/guild-preview/guild-preview";
import guild_style from "@/components/guild-preview/guild-preview.module.scss";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { act } from "react-dom/test-utils";

const DashboardClient = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);
  const [active_guilds, setActiveGuilds] = useState<GuildDTO[]>([]);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined) {
        return;
      }

      const discord = window.sessionStorage.getItem("discord_token");
      const token = getCookie("user_token");
      if (discord === null || token === null) {
        return (window.location.href = "/vaultonix/login");
      }

      const u = await getUserFromToken(token);
      const gs = await getMyGuilds();
      const ags = await getVaultonixActiveGuilds(gs);

      setUser(u);
      setActiveGuilds(ags);
      setLoading(false);
    })();
  }, []);

  if (loading || user === null) {
    return <Loading />;
  }

  if (active_guilds.length <= 0) {
    return (
      <>
        <Header user={user} />
        <main className="container">
          <div className="grid">
            <div className="item">
              <span style={{ fontWeight: "100" }}>
                Logged in as {user.username}
              </span>
              <h1>Dashboard</h1>
              <span>You have no servers that are active with Vaultonix :(</span>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid">
          <div className="item">
            <span style={{ fontWeight: "100" }}>
              Logged in as {user.username}
            </span>
            <h1>Dashboard</h1>
            <span>
              Here you can manage all your servers, their configurations,
              members, and view other useful information
            </span>
          </div>
          <div className="item">
            {active_guilds.length <= 0 ? (
              <>
                <h3>
                  You aren&apos;t in any servers that are Vaultonix Active....
                </h3>
                {DISCORD_INVITE && (
                  <Link
                    href={DISCORD_INVITE}
                    style={{
                      fontWeight: "800",
                      textTransform: "uppercase",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "var(--primary-300)",
                      color: "inherit !important",
                      width: "fit-content",
                    }}
                    target="_blank"
                  >
                    Invite Vaultonix to your Server
                  </Link>
                )}
              </>
            ) : (
              <div className={guild_style.guilds}>
                {active_guilds.map((active_guild: GuildDTO, index: number) => {
                  return (
                    <Link
                      key={index}
                      href={`/vaultonix/dashboard/${active_guild.id}`}
                    >
                      <GuildPreview guild={active_guild} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardClient;
