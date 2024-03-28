"use client";

import { getStoreItem, purchaseItemWithCredits } from "@/api/store/store.api";
import { StoreEntryDTO } from "@/api/store/store.dto";
import { getUserFromGuild, getUserFromToken, getUserFromVaultonix } from "@/api/user/user.api";
import { GuildUserDTO, UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./item.module.scss";
import Link from "next/link";
import PurchaseLink from "@/components/purchase-link/purchase-link";
import GuildSelector from "@/components/guild-selector/guild-selector";
import Popup from "@/components/popup/popup";
import { VaultonixGuildDTO } from "@/api/discord/discord.dto";
import { getGuildFromVaultonix } from "@/api/discord/discord.api";

const StoreItemClient = (props: { item_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [item, setItem] = useState<StoreEntryDTO | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guild_user, setGuildUser] = useState<GuildUserDTO | null>(null);
  const [current_guild, setCurrentGuild] = useState<string>("");
  const [current_guild_data, setCurrentGuildData] = useState<VaultonixGuildDTO | null>(null);
  const [show_popup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        window.location.href = "/vaultonix/login";
      }

      const u = await getUserFromToken(user_token);
      const i = await getStoreItem(Number.parseInt(props.item_id));

      setUser(u);
      setItem(i);
      setLoading(false);
    })();
  }, [props.item_id]);

  useEffect(() => {
    (async () => {
      const g = await getGuildFromVaultonix(current_guild);
      const gu = await getUserFromGuild(g?.guild_id || "", user?.discord_id || "");
      setGuildUser(gu);
      setCurrentGuildData(g);
    })();
  }, [current_guild, user?.discord_id]);

  if (loading || user === null || item === null) {
    return <Loading />;
  }

  const purchaseWithCredits = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const purchase = await purchaseItemWithCredits(item.id, current_guild, user.discord_id);
    if (purchase) {
      setShowPopup(false);
    }
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/vaultonix/item-store">Item Store</Link>
        <div className="grid" style={{ gridTemplateColumns: "25% auto" }}>
          <div
            className="item"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              src={item.thumbnail}
              alt="Thumbnail"
              sizes="100%"
              width={0}
              height={0}
              className={style.thumbnail}
            />
          </div>
          <div className="item">
            <h1>{item.name}</h1>
            <p>{item.description}</p>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "35% auto" }}>
          <div className="item">
            <h3>Prices</h3>
            {item.credit_price <= 0 ? (
              <span>Not Available For Credits</span>
            ) : (
              <span>{item.credit_price} Credits</span>
            )}
            {item.money_price <= 0 ? (
              <span>Not Available For Money</span>
            ) : (
              <span>Purchase for ${item.money_price}</span>
            )}
          </div>
          <div className="item">
            <h3>Purchase</h3>
            <GuildSelector
              on_guild_select={(guild_id: string) => setCurrentGuild(guild_id)}
            />
            {current_guild_data !== null && (
              <>
                <span style={{"opacity": "0.5"}}>(This item will go into your inventory within this guild)</span>
                <section style={{ display: "flex", gap: "1rem" }}>
                  {item.credit_price !== -1 && (
                    <>
                      <button onClick={() => setShowPopup(true)}>Buy with Credits</button>
                      {show_popup && <Popup>
                        <h3>Confirm Item Purchase</h3>
                        <span>Logged in as {user.username}</span>
                        <span>Destination: {current_guild_data.guild_name}</span>
                        <span>Total price: {item.credit_price} Credits</span>
                        <span>Balance after transaction: {(guild_user?.credits || 0) - item.credit_price}</span>
                        <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                          <button onClick={purchaseWithCredits}>Confirm</button>
                          <button onClick={() => setShowPopup(false)}>Cancel</button>
                        </section>
                      </Popup>}
                    </>
                  )}
                  {item.money_price !== -1 && <button>Buy with Money</button>}
                </section>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StoreItemClient;
