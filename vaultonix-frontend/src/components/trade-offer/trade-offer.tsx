"use client";

import { TradeDTO } from "@/api/vaultonix/vaultonix.dto";
import style from "./trade-offer.module.scss";
import { useEffect, useState } from "react";
import { GuildDTO } from "@/api/discord/discord.dto";
import { GuildMemberDTO, UserDTO } from "@/api/user/user.dto";
import { getUserFromVaultonix } from "@/api/user/user.api";
import Image from "next/image";
import { DISCORD_API, DISCORD_CDN } from "@/api/resources";

const TradeOffer = (props: { trade_offer: TradeDTO; guild: GuildDTO }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<GuildMemberDTO | null>(null);
  const [partner, setPartner] = useState<GuildMemberDTO | null>(null);

  useEffect(() => {
    (async () => {
      const uc = await getUserFromVaultonix(
        props.trade_offer.user_id,
        props.trade_offer.guild_id
      );
      if (uc === null) return;

      const pc = await getUserFromVaultonix(
        props.trade_offer.partner_id,
        props.trade_offer.guild_id
      );
      if (pc === null) return;

      setPartner(pc);
      setUser(uc);
      setLoading(false);
    })();
  }, [props.trade_offer]);

  if (loading || user === null || partner === null) {
    return <span>Loading...</span>;
  }

  return (
    <div
      className={style.trade_offer}
      style={{ opacity: props.trade_offer.trade_complete ? "0.5" : "1" }}
    >
      <h3>Trade Offer <span style={{"opacity": "0.5"}}>(ID: {props.trade_offer.id})</span></h3>
      <div className={style.user}>
        <span>Sender: </span>
        <Image
          src={`${DISCORD_CDN}/avatars/${user.user.id}/${user.user.avatar}`}
          alt="PFP"
          sizes="100%"
          width={0}
          height={0}
          className={style.pfp}
        />
        <span>{user.user.global_name}</span>
      </div>
      <div className={style.user}>
        <span>Receiver: </span>
        <Image
          src={`${DISCORD_CDN}/avatars/${partner.user.id}/${partner.user.avatar}`}
          alt="PFP"
          sizes="100%"
          width={0}
          height={0}
          className={style.pfp}
        />
        <span>{partner.user.global_name}</span>
      </div>
    </div>
  );
};

export default TradeOffer;
