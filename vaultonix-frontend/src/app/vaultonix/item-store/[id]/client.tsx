"use client";

import { getStoreItem } from "@/api/store/store.api";
import { StoreEntryDTO } from "@/api/store/store.dto";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import style from "./item.module.scss";
import Link from "next/link";

const StoreItemClient = (props: { item_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [item, setItem] = useState<StoreEntryDTO | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof(window) === undefined || typeof(document) === undefined) return;

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

  if (loading || user === null || item === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/vaultonix/item-store">Item Store</Link>
        <div className="grid" style={{"gridTemplateColumns": "25% auto"}}>
          <div className="item" style={{"alignItems": "center", "justifyContent": "center"}}>
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
        <div className="grid" style={{"gridTemplateColumns": "35% auto"}}>
          <div className="item">
            <h3>Prices</h3>
            {item.credit_price <= 0 ? <span>Not Available For Credits</span> : <span>{item.credit_price} Credits</span>}
            {item.money_price <= 0 ? <span>Not Available For Money</span> : <span>Purchase for ${item.money_price}</span>}
          </div>
          <div className="item">
            <h3></h3>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StoreItemClient;
