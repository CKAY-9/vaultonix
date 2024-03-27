"use client";

import {
  createStoreItem,
  getStoreData,
  getStoreItems,
} from "@/api/store/store.api";
import { ItemStoreDTO, StoreEntryDTO } from "@/api/store/store.dto";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Image from "next/image";
import Link from "next/link";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./admin.module.scss";
import ItemPreview from "@/components/item-preview/item-preview";

const StoreInventory = (props: { items: StoreEntryDTO[] }) => {
  return (
    <>
      <div className="grid">
        <div className="item">
          {props.items.length <= 0 && <h3>There are no store items currently...</h3>}
          <div className={style.items}>
            {props.items.map((item: StoreEntryDTO, index: number) => {
              return (
                <ItemPreview item={item} key={index} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const NewStoreItem = (props: { on_create: any }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [item_id, setItemID] = useState<string>("");
  const [credit_price, setCreditPrice] = useState<number>(0);
  const [money_price, setMoneyPrice] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [sale, setSale] = useState<number>(0);
  const [premium, setPremium] = useState<boolean>(false);

  const create = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const request = await createStoreItem(
      credit_price,
      money_price,
      name,
      item_id,
      thumbnail,
      description,
      stock,
      sale,
      premium
    );
    if (request.length >= 1) {
      props.on_create(request);
    }
  };

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "60% auto" }}>
        <div className="item">
          <h2>New Store Item</h2>
          <span>Create new items for the Vaultonix Item Store.</span>
        </div>
        <div className="item">
          <h3>Guildlines</h3>
          <ul style={{ margin: "0", listStyle: "numeric" }}>
            <li>Make sure item images are unique and stand out</li>
            <li>
              Make prices reasonable and sensable. The baseline is &apos;One Day
              Credit Booster = 1000 Credits&apos;
            </li>
            <li>Limit the use of premium items</li>
          </ul>
        </div>
      </div>
      <div className="grid">
        <div className="item">
          <h3>Information</h3>
          <input
            onChange={(e: BaseSyntheticEvent) => setItemID(e.target.value)}
            type="text"
            placeholder="Item ID"
          />
          <input
            onChange={(e: BaseSyntheticEvent) => setName(e.target.value)}
            type="text"
            placeholder="Item Name"
          />
          <textarea
            onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)}
            cols={30}
            rows={5}
            placeholder="Item Description"
          ></textarea>
          <input
            onChange={(e: BaseSyntheticEvent) => setThumbnail(e.target.value)}
            type="text"
            placeholder="Item Image URL"
          />
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "65% auto" }}>
        <div className="item">
          <h3>Details</h3>
          <input
            onChange={(e: BaseSyntheticEvent) => setStock(e.target.value)}
            type="number"
            min={-1}
            max={100_000_000}
            placeholder="Stock (-1 for infinite)"
          />
          <input
            onChange={(e: BaseSyntheticEvent) => setCreditPrice(e.target.value)}
            type="number"
            min={-1}
            max={100_000_000}
            placeholder="Credit Price (-1 for not available)"
          />
          <input
            onChange={(e: BaseSyntheticEvent) => setMoneyPrice(e.target.value)}
            type="number"
            min={-1}
            max={100_000_000}
            placeholder="Dollar Price (-1 for not available)"
          />
          <section>
            <label className="rainbow" style={{ fontWeight: "700" }}>
              PREMIUM
            </label>
            <input type="checkbox" defaultChecked={false} />
          </section>
        </div>
        <div className="item">
          <h3>Completion</h3>
          <button onClick={create}>Create</button>
        </div>
      </div>
    </>
  );
};

const ItemStoreAdminClient = (props: { user: UserDTO }) => {
  const [current_view, setCurrentView] = useState<number>(0);
  const [store_data, setStoreData] = useState<ItemStoreDTO | null>(null);
  const [store_items, setStoreItems] = useState<StoreEntryDTO[]>([]);

  useEffect(() => {
    (async () => {
      const store = await getStoreData();
      const items = await getStoreItems();
      setStoreItems(items);
      setStoreData(store);
    })();
  }, []);

  const onItemCreate = async (new_inventory: StoreEntryDTO[]) => {
    setStoreItems(new_inventory);
  };

  return (
    <>
      <Header user={props.user} />
      <main className="container">
        <Link href="/vaultonix/item-store">Item Store</Link>
        <div className="grid" style={{ gridTemplateColumns: "70% auto" }}>
          <div className="item">
            <h1>Item Store Admin</h1>
            <span>
              Manage the official Vaultonix Item Store&apos;s items, prices, etc.
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
            {store_data === null ? (
              <span>Loading...</span>
            ) : (
              <>
                <span>
                  Total Credits Spent: {store_data.total_credits_spent}
                </span>
                <span>Total Money Spent: ${store_data.total_money_spent}</span>
                <span>Total Transactions: {store_data.total_transactions}</span>
                <span>Current Sale: {store_data.global_sale}%</span>
              </>
            )}
          </div>
        </div>
        <div className="grid">
          <div
            className="item"
            style={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            <button onClick={() => setCurrentView(0)}>View Items</button>
            <button onClick={() => setCurrentView(1)}>New Item</button>
          </div>
        </div>
        <div
          style={{
            display: current_view === 0 ? "flex" : "none",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <StoreInventory items={store_items} />
        </div>
        <div
          style={{
            display: current_view === 1 ? "flex" : "none",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <NewStoreItem on_create={onItemCreate} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ItemStoreAdminClient;
