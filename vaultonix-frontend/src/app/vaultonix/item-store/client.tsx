"use client";

import { getStoreData, getStoreItems } from "@/api/store/store.api";
import { ItemStoreDTO, StoreEntryDTO } from "@/api/store/store.dto";
import { getUserFromToken, getUserStaff } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ItemPreview from "@/components/item-preview/item-preview";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import style from "./item-store.module.scss";

const ItemStoreClient = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [item_store, setItemStore] = useState<ItemStoreDTO | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [store_items, setStoreItems] = useState<StoreEntryDTO[]>([]);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        window.location.href = "/vaultonix/login";
      }

      const u = await getUserFromToken(user_token);
      const is = await getStoreData();
      const items = await getStoreItems();

      setItemStore(is);
      setStoreItems(items);
      setUser(u);
      setLoading(false);

      if (u === null) return;

      const is_staff = await getUserStaff(u.id);
      if (is_staff === null) return;

      setAdmin(true);
    })();
  }, []);

  if (loading || user === null || item_store === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        {admin && (
          <Link href="/vaultonix/item-store/admin">Item Store Admin</Link>
        )}
        <Link href="/vaultonix">Vaultonix</Link>
        <div className="grid" style={{ gridTemplateColumns: "70% auto" }}>
          <div className="item">
            <h1>Vaultonix&apos;s Item Store</h1>
            <span>
              This is Vaultonix&apos;s Official Item Store. You can buy items from
              Vaultonix that might not be available elsewhere.
            </span>
          </div>
          <div className="item">
            <section
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
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
            <span>Total Credits Spent: {item_store.total_credits_spent}</span>
            <span>Total Money Spent: ${item_store.total_money_spent}</span>
            <span>Total Transactions: {item_store.total_transactions}</span>
            <span>Current Sale: {item_store.global_sale}%</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            <h3>Inventory</h3>
            {store_items.length <= 0 && (
              <h4>There are currently no items in the store.</h4>
            )}
            <div className={style.items}>
              {store_items.map((item: StoreEntryDTO, index: number) => {
                return (
                  <Link href={`/vaultonix/item-store/${item.id}`} key={index}>
                    <ItemPreview item={item} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ItemStoreClient;
