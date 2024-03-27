import { GuildChannelDTO } from "@/api/discord/discord.dto";
import style from "./welcome-goodbye.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  getWelcomeGoodbyeForGuild,
  updateWelcomeGoodbyeForGuild,
} from "@/api/vaultonix/vaultonix.api";

const WelcomeGoodbyeModule = (props: {
  guild_id: string;
  guild_channels: GuildChannelDTO[];
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [welcome, setWelcome] = useState<string>("");
  const [goodbye, setGoodbye] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const get_welcome = await getWelcomeGoodbyeForGuild(props.guild_id);
      if (get_welcome === null) {
        return;
      }

      setWelcome(get_welcome.welcome);
      setGoodbye(get_welcome.goodbye);
      setEnabled(get_welcome.enabled);
      setChannel(get_welcome.channel_id);
      setLoading(false);

      const update = await updateWelcomeGoodbyeForGuild(
        props.guild_id,
        channel,
        welcome,
        goodbye,
        enabled
      );
    })();
  }, [props.guild_id, channel, welcome, goodbye, enabled]);

  const update = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    await updateWelcomeGoodbyeForGuild(
      props.guild_id,
      channel,
      welcome,
      goodbye,
      enabled
    );
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <>
      <h3>Welcome/Goodbye Message</h3>
      <span>
        Say welcome or goodbye to users joining and leaving your server
      </span>
      <label>Welcome</label>
      <textarea
        defaultValue={welcome}
        onChange={(e: BaseSyntheticEvent) => setWelcome(e.target.value)}
        placeholder="You can use {username} to say their name, {guild} to say the guild's name, {count} to say their member count"
        cols={30}
        rows={2}
      ></textarea>
      <label>Goodbye</label>
      <textarea
        defaultValue={goodbye}
        onChange={(e: BaseSyntheticEvent) => setGoodbye(e.target.value)}
        placeholder="You can use {username} to say their name, {guild} to say the guild's name, {count} to say their member count"
        cols={30}
        rows={2}
      ></textarea>
      <select
        defaultValue={channel}
        onChange={(e: BaseSyntheticEvent) => setChannel(e.target.value)}
      >
        {channel !== "" ? (
          <>
            {props.guild_channels
              .filter((c) => c.type === 0)
              .map((c, index) => {
                return (
                  <option key={index} value={c.id}>
                    #{c.name}
                  </option>
                );
              })}
            <option value="">SELECT CHANNEL</option>
          </>
        ) : (
          <>
            <option value="">SELECT CHANNEL</option>
            {props.guild_channels
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

export default WelcomeGoodbyeModule;
