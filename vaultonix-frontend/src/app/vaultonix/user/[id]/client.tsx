"use client";

import { getUserFromID, getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import style from "./user.module.scss";

const UserClient = (props: { user_id: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof window === undefined || typeof document === undefined) {
        return;
      }

      const p = await getUserFromID(props.user_id);
      if (p === null) {
        window.location.href = "/vaultonix";
      }
      setProfile(p);

      const discord_token = window.sessionStorage.getItem("discord_token");
      const user_token = getCookie("user_token");
      if (discord_token !== null && user_token !== null) {
        const u = await getUserFromToken(user_token);
        setUser(u);
      }

      setLoading(false);
    })();
  }, [props.user_id]);

  if (loading || profile === null) {
    return <Loading />;
  }

  return (
    <>
      <Header user={user} />
      <main className="container">
        <div className="grid">
          <div className="item">
            <Image
              src={profile.avatar_url}
              alt="PFP"
              sizes="100%"
              width={0}
              height={0}
              className={style.icon}
            />
            <h1>{profile.username}</h1>
            {profile.supporter && <span className="rainbow">SUPPORTER</span>}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserClient;
