"use client";

import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { useEffect, useState } from "react";

const AuctionClient = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof document === undefined || typeof window === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (user_token === null || discord_token === null) {
        window.location.href = "/vaultonix/login";
      }

      const u = await getUserFromToken(user_token);
      setUser(u);
      setLoading(false);
    })();
  }, []);

  if (loading || user === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid" style={{ gridTemplateColumns: "70% auto" }}>
          <div className="item">
            <h1>Auction House</h1>
            <span>
              Vaultonix&apos;s Official Auction House. Buy/Sell items and out-bid
              them broke boys.
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
            <span>Total Transactions: 0</span>
            <span>Total Credits Spent: 0</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuctionClient;
