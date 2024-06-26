"use client";

import {
  getGuildChannelsFromVaultonix,
  getGuildConfig,
  getMyGuilds,
  getVaultonixActiveGuilds,
} from "@/api/discord/discord.api";
import {
  GuildChannelDTO,
  GuildDTO,
  GuildSettingsDTO,
} from "@/api/discord/discord.dto";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import AutoRolesModule from "@/components/modules/auto-roles/auto-roles";
import LevelRewardsModule from "@/components/modules/level-rewards/level-rewards";
import LoggingModule from "@/components/modules/logging/logging";
import TriviaModule from "@/components/modules/trivia/trivia";
import WarnsModule from "@/components/modules/warns/warns";
import WelcomeGoodbyeModule from "@/components/modules/welcome-goodbye/welcome-goodbye";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const GuildDashboardClient = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guild, setGuild] = useState<GuildDTO | null>(null);
  const [is_active, setIsActive] = useState<boolean>(false);
  const [config, setConfig] = useState<GuildSettingsDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) {
        return;
      }

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        window.location.href = "/vaultonix/login";
      }

      const u = await getUserFromToken(user_token);
      if (u === null) {
        window.location.href = "/vaultonix";
      }
      const guilds = await getMyGuilds();
      for (let i = 0; i < guilds.length; i++) {
        const g = guilds[i];
        if (g.id === props.guild_id) {
          setGuild(g);
          break;
        }
      }

      const conf = await getGuildConfig(props.guild_id);
      const chnls = await getGuildChannelsFromVaultonix(props.guild_id);

      setUser(u);
      setConfig(conf);
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading || user === null || config === null || guild === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/vaultonix/dashboard">Dashboard</Link>
        <div className="grid" style={{ gridTemplateColumns: "65% auto" }}>
          <div className="item">
            <h1>{guild.name}</h1>
          </div>
          <div className="item">
            <section
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3>Information</h3>
              <Image
                src="/stats.svg"
                alt="Stats"
                sizes="100%"
                width={0}
                height={0}
                style={{ width: "2rem", height: "2rem", filter: "invert(1)" }}
              />
            </section>
            <span>{guild.approximate_member_count || 1} Members</span>
            <span>Owner: {guild.owner ? "YES" : "NO"}</span>
            <span>Guild ID: {guild.id}</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            <h2>Modules</h2>
            <span>
              Modules are small parts of Vaultonix that offer more
              functionality. Each can be enabled and disabled to your liking
            </span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "55% auto" }}>
          <div className="item">
            <AutoRolesModule guild_config={config} guild_id={props.guild_id} />
          </div>
          <div className="item">
            <WelcomeGoodbyeModule
              guild_id={props.guild_id}
            />
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "60% auto" }}>
          <div className="item">
            <LoggingModule guild_id={props.guild_id} />
          </div>
          <div className="item">
            <WarnsModule />
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "auto 55%" }}>
          <div className="item">
            <LevelRewardsModule guild_id={props.guild_id} />
          </div>
          <div
            className="item"
            style={{ opacity: user.supporter ? "1" : "0.75" }}
          >
            <h3 className="rainbow">SERVER WIDE BOOSTERS</h3>
            <span>Bless your server with XP and Credit boosters</span>
            {!user.supporter && <span>Premium Feature</span>}
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "auto 60%" }}>
          <div
            className="item"
            style={{ opacity: user.supporter ? "1" : "0.75" }}
          >
            <h3 className="rainbow">MINECRAFT TO DISCORD CHAT</h3>
            <span>
              Enable real-time chat between your Discord and Minecraft servers
            </span>
            {!user.supporter && <span>Premium Feature</span>}
          </div>
          <div className="item">
            <h3>Trading</h3>
            <span>Allow users to trade their items with eachother</span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "auto 50%" }}>
          <div className="item">
            <TriviaModule guild_id={props.guild_id} />
          </div>
          <div
            className="item"
            style={{ opacity: user.supporter ? "1" : "0.75" }}
          >
            <h3 className="rainbow">GLOBAL TRADING</h3>
            <span>
              Allow users to trade with users in other Discord communities.
            </span>
            {!user.supporter && <span>Premium Feature</span>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GuildDashboardClient;
