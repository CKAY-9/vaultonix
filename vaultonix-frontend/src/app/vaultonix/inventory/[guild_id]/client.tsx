"use client";

import {
  getGuildFromDiscord,
  getGuildFromVaultonix,
} from "@/api/discord/discord.api";
import { GuildDTO, VaultonixGuildDTO } from "@/api/discord/discord.dto";
import { DISCORD_CDN } from "@/api/resources";
import { getUserFromGuild, getUserFromToken } from "@/api/user/user.api";
import { GuildUserDTO, UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import style from "./inventory.module.scss";
import Link from "next/link";
import { StoreEntryDTO } from "@/api/store/store.dto";
import { getStoreItem } from "@/api/store/store.api";

const Item = (props: { item_id: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [item, setItem] = useState<StoreEntryDTO | null>(null);

  useEffect(() => {
    (async () => {
      const i = await getStoreItem(props.item_id);
      if (i === null) return;

      setItem(i);
      setLoading(false);
    })();
  }, [props.item_id]);

  if (loading || item === null) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className={style.item}>
      <Image
        src={item.thumbnail}
        alt="Thumbnail"
        sizes="100%"
        width={0}
        height={0}
        className={style.thumbnail}
      />
      <span className={style.name}>{item.name}</span>
      <section style={{"display": "flex", "gap": "0.5rem"}}>
        {item.credit_price !== -1 && <span>{item.credit_price} Credits</span>}
        {item.money_price !== -1 && (
          <>
            <div style={{"width": "2px", "height": "1rem", "backgroundColor": "white"}}></div>
            <span>${item.money_price}</span>
          </>
        )}
      </section>
    </div>
  );
};

const GuildInventoryClient = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guild, setGuild] = useState<GuildDTO | null>(null);
  const [guild_user, setGuildUser] = useState<GuildUserDTO | null>(null);
  const [inventory, setInventory] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      if (typeof document === undefined || typeof window === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (user_token === null || discord_token === null) {
        return (window.location.href = "/vaultonix/login");
      }

      const g = await getGuildFromDiscord(props.guild_id);
      const u = await getUserFromToken(user_token);
      if (u === null || g === null) return;

      const gu = await getUserFromGuild(g.id, u.discord_id);
      if (gu === null) return;

      const inv = JSON.parse(gu.inventory);

      setInventory(inv);
      setGuildUser(gu);
      setGuild(g);
      setUser(u);
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading || user === null || guild === null || guild_user === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/vaultonix/inventory">All Inventories</Link>
        <div className="grid" style={{ gridTemplateColumns: "65% auto" }}>
          <div className="item">
            <Image
              src={`${DISCORD_CDN}/icons/${guild.id}/${guild.icon}`}
              alt="Icon"
              sizes="100%"
              width={0}
              height={0}
              className={style.icon}
            />
            <h1>{guild.name}</h1>
            <span>Manage your inventory for {guild.name}</span>
          </div>
          <div className="item">
            <section
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
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
            <span>{guild_user.credits} Credits</span>
            <span>{inventory.length} Items</span>
            <span>0 Untradable Items</span>
            <span>0 Unique Items</span>
            <span>0 Sell Value</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            <h3>Inventory</h3>
            {inventory.length <= 0 ? (
              <span>You have no items in your inventory...</span>
            ) : (
              <>
                <div className={style.items}>
                  {inventory.map((entry, index) => {
                    return <Item item_id={entry} key={index} />;
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

export default GuildInventoryClient;
