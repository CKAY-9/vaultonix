"use client";

import {
  getMyGuilds,
  getVaultonixActiveGuilds,
} from "@/api/discord/discord.api";
import { GuildDTO } from "@/api/discord/discord.dto";
import { getUserFromToken, getUserTrades } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import { TradeDTO } from "@/api/vaultonix/vaultonix.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";
import style from "./trade.module.scss";
import Image from "next/image";
import { DISCORD_CDN } from "@/api/resources";
import TradeOffer from "@/components/trade-offer/trade-offer";
import Link from "next/link";

const Guild = (props: { guild: GuildDTO; user_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trades, setTrades] = useState<TradeDTO[]>([]);

  useEffect(() => {
    (async () => {
      const ts = await getUserTrades(props.user_id, props.guild.id);
      setTrades(ts);
      setLoading(false);
    })();
  }, [props.guild.id, props.user_id]);

  return (
    <div className={style.guild}>
      <section style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Image
          src={`${DISCORD_CDN}/icons/${props.guild.id}/${props.guild.icon}`}
          alt="Icon"
          sizes="100%"
          width={0}
          height={0}
          className={style.icon}
        />
        <h4>{props.guild.name}</h4>
      </section>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div className={style.offers}>
          {trades.map((trade, index) => {
            return (
              <Link key={index} href={`/vaultonix/trade/${trade.id}`}>
                <TradeOffer
                  guild={props.guild}
                  trade_offer={trade}
                  key={index}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TradeClient = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        return (window.location.href = "/vaultonix/login");
      }

      const u = await getUserFromToken(user_token);
      if (u === null) return;

      const g = await getMyGuilds();
      const ag = await getVaultonixActiveGuilds(g);
      setGuilds(ag);
      setUser(u);
      setLoading(false);
    })();
  }, []);

  if (user === null || loading) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid">
          <div className="item">
            <h1>Trades</h1>
            <span>View all your trades and trade offers for your guilds.</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            {guilds.length <= 0 ? (
              <h3>You have no trades available...</h3>
            ) : (
              <>
                <div className={style.guilds}>
                  {guilds.map((guild, index) => {
                    return (
                      <Guild
                        user_id={user.discord_id}
                        guild={guild}
                        key={index}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TradeClient;
