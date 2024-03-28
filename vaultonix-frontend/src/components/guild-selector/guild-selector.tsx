"use client";

import { useEffect, useState } from "react";
import style from "./guild-selector.module.scss";
import { GuildDTO } from "@/api/discord/discord.dto";
import { getMyGuilds, getVaultonixActiveGuilds } from "@/api/discord/discord.api";
import Image from "next/image";
import { DISCORD_CDN } from "@/api/resources";

const GuildSelector = (props: { on_guild_select: any }) => {
  const [selected_guild, setSelectedGuild] = useState<number>(-1);
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showing_all, setShowingAll] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof document === undefined || typeof window === undefined) return;

      const gs = await getMyGuilds();
      const filtered = await getVaultonixActiveGuilds(gs);
      setGuilds(filtered);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <div className={style.guild_selector}>
      <button
        onClick={() => setShowingAll(!showing_all)}
        id={style.current_guild}
        style={{
          borderBottomLeftRadius: showing_all ? "0px !important" : "0.5rem",
        }}
      >
        {selected_guild === -1 ? (
          <>
            <div className={style.def_guild}></div>
            <span>Select a guild...</span>
          </>
        ) : (
          <div className={style.current_guild}>
            <Image 
              src={`${DISCORD_CDN}/icons/${guilds[selected_guild].id}/${guilds[selected_guild].icon}`}
              alt="Icon"
              sizes="100%"
              width={0}
              height={0}
              className={style.icon}
            />
            <span>{guilds[selected_guild].name}</span>
          </div>
        )}
      </button>
      {showing_all && (
        <div className={style.all_guilds}>
          {guilds.map((guild, index) => {
            return (
              <button
                onClick={() => {
                  setSelectedGuild(index);
                  setShowingAll(false);
                  props.on_guild_select(guild.id);
                }}
                className={style.guild}
                key={index}
              >
                <Image
                  src={`${DISCORD_CDN}/icons/${guild.id}/${guild.icon}`}
                  alt="Icon"
                  sizes="100%"
                  width={0}
                  height={0}
                  className={style.icon}
                />
                <span>{guild.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuildSelector;
