"use client"

import { getGuildChannelsFromVaultonix } from "@/api/discord/discord.api";
import { GuildChannelDTO } from "@/api/discord/discord.dto";
import { BaseSyntheticEvent, useEffect, useState } from "react";

const ChannelDropdown = (props: { 
  guild_id: string;
  on_change: any;
 }) => {
  const [channel, setChannel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [channels, setChannels] = useState<GuildChannelDTO[]>([]);

  useEffect(() => {
    (async () => {
      const chnls = await getGuildChannelsFromVaultonix(props.guild_id);
      setChannels(chnls);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (<span>Loading...</span>);
  }

  return (
    <>
      <select
        defaultValue={channel}
        onChange={(e: BaseSyntheticEvent) => props.on_change(e.target.value)}
      >
        {channel !== "" ? (
          <>
            {channels
              .filter((c) => c.type === 0)
              .map((c, index) => {
                return (
                  <option key={index} value={c.id}>
                    #{c.name}
                  </option>
                );
              })}
            <option value="">Select Channel...</option>
          </>
        ) : (
          <>
            <option value="">Select Channel...</option>
            {channels
              .filter((channel) => channel.type === 0)
              .map((channel, index) => {
                return (
                  <option key={index} value={channel.id}>
                    #{channel.name}
                  </option>
                );
              })}
          </>
        )}
      </select>
    </>
  );
};

export default ChannelDropdown;
