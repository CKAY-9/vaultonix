"use client";

import {
  getMyGuilds,
  getVaultonixActiveGuilds,
} from "@/api/discord/discord.api";
import { GuildDTO } from "@/api/discord/discord.dto";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";
import style from "./inventory.module.scss";
import Image from "next/image";
import { DISCORD_CDN } from "@/api/resources";
import Link from "next/link";

const InventoryClient = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);

  useEffect(() => {
    (async () => {
      if (typeof document === undefined || typeof window === undefined) return;

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token === null || user_token === null) {
        return (window.location.href = "/vaultonix/login");
      }

      const g = await getMyGuilds();
      const ag = await getVaultonixActiveGuilds(g);
      const u = await getUserFromToken(user_token);
      setUser(u);
      setGuilds(ag);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Header user={user} />
      <main className="container">
        <Link href="/vaultonix">Vaultonix</Link>
        <div className="grid">
          <div className="item">
            <h1>Your Inventories</h1>
            <span>You can select which guild inventory you want to view.</span>
          </div>
        </div>
        <div className="grid">
          <div className="item">
            {guilds.length <= 0 ? (
              <h3>You aren&apos;t in any Vautlonix active guilds...</h3>
            ) : (
              <>
                <h3>Guilds</h3>
                <div className={style.inventories}>  
                  {guilds.map((guild, index) => {
                    return <Link href={`/vaultonix/inventory/${guild.id}`} className={style.inventory}>
                      <Image 
                        src={`${DISCORD_CDN}/icons/${guild.id}/${guild.icon}`}
                        alt="Icon"
                        sizes="100%"
                        width={0}
                        height={0}
                        className={style.icon}
                      />
                      <h4>{guild.name}</h4>
                    </Link>;
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

export default InventoryClient;
