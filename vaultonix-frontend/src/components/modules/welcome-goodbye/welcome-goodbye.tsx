import { GuildChannelDTO } from "@/api/discord/discord.dto";
import style from "./welcome-goodbye.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  getWelcomeGoodbyeForGuild,
  updateWelcomeGoodbyeForGuild,
} from "@/api/vaultonix/vaultonix.api";
import ChannelDropdown from "@/components/channel-dropdown/channel-dropdown";

const WelcomeGoodbyeModule = (props: { guild_id: string }) => {
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
    })();
  }, [props.guild_id]);

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

  const onChange = (channel_id: string) => {
    setChannel(channel_id);
  };

  return (
    <>
      <h3>Welcome/Goodbye Message</h3>
      <span>
        Say welcome or goodbye to users joining and leaving your server
      </span>
      <h4>Welcome</h4>
      <textarea
        defaultValue={welcome}
        onChange={(e: BaseSyntheticEvent) => setWelcome(e.target.value)}
        placeholder="You can use {username} to say their name, {guild} to say the guild's name, {count} to say their member count"
        cols={30}
        rows={2}
      ></textarea>
      <h4>Goodbye</h4>
      <textarea
        defaultValue={goodbye}
        onChange={(e: BaseSyntheticEvent) => setGoodbye(e.target.value)}
        placeholder="You can use {username} to say their name, {guild} to say the guild's name, {count} to say their member count"
        cols={30}
        rows={2}
      ></textarea>
      <ChannelDropdown on_change={onChange} guild_id={props.guild_id} />
      <button onClick={update}>Update</button>
    </>
  );
};

export default WelcomeGoodbyeModule;
