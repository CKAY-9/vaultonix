"use client";

import { useEffect, useState } from "react";
import style from "./guild-selector.module.scss";
import { GuildDTO } from "@/api/discord/discord.dto";
import { getMyGuilds } from "@/api/discord/discord.api";

const GuildSelector = (props: { on_guild_select: any }) => {
  const [selected_guild, setSelectedGuild] = useState<string>("");
  const [guilds, setGuilds] = useState<GuildDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (typeof(document) === undefined || typeof(window) === undefined) return;
    
      const gs = await getMyGuilds();
      setGuilds(gs);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (<></>);
  }

  return (
    <div className={style.guild_selector}>
      <div id={style.current_guild}>
        {selected_guild.length <= 0 && (
          <>
            <div className={style.def_guild}></div>
            <span>Select a guild...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default GuildSelector;
