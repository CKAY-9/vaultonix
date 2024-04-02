"use client";

import { getUserFromDiscord } from "@/api/discord/discord.api";
import { getUserFromGuild, getUserFromToken } from "@/api/user/user.api";
import {
  DiscordUserDTO,
  GuildMemberDTO,
  GuildUserDTO,
  UserDTO,
} from "@/api/user/user.dto";
import { getTradeFromID } from "@/api/vaultonix/vaultonix.api";
import { TradeDTO } from "@/api/vaultonix/vaultonix.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";

const TradeOfferClient = (props: { trade_id: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trade, setTrade] = useState<TradeDTO | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [sender, setSender] = useState<GuildUserDTO | null>(null);
  const [sender_d, setSenderD] = useState<DiscordUserDTO | null>(null);
  const [receiver, setReceiever] = useState<GuildUserDTO | null>(null);
  const [receiver_d, setReceiverD] = useState<DiscordUserDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (user_token === null || discord_token === null) {
        return (window.location.href = "/vaultonix/login");
      }

      const u = await getUserFromToken(user_token);
      if (u === null) return;

      const t = await getTradeFromID(props.trade_id);
      if (t === null) return;

      const s = await getUserFromGuild(t.guild_id, t.user_id);
      if (s === null) return;

      const r = await getUserFromGuild(t.guild_id, t.partner_id);
      if (r === null) return;

      const sd = await getUserFromDiscord(s.user_id, s.guild_id);
      if (sd === null) return;

      const rd = await getUserFromDiscord(r.user_id, r.guild_id);
      if (rd === null) return;

      setReceiever(r);
      setReceiverD(rd);
      setSender(s);
      setSenderD(sd);
      setUser(u);
      setTrade(t);
      setLoading(false);
    })();
  }, [props.trade_id]);

  if (
    loading ||
    user === null ||
    sender === null ||
    receiver === null ||
    receiver_d === null ||
    sender_d === null
  ) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid">
          <div className="item">
            <h1>Trade Offer</h1>
            <span>
              This is a trade offer between {sender_d?.global_name} and{" "}
              {receiver_d?.global_name}.
            </span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "50% auto" }}>
          <div className="item"></div>
          <div className="item"></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TradeOfferClient;
