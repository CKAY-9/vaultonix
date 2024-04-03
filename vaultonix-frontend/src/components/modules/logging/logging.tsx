"use client";

import ChannelDropdown from "@/components/channel-dropdown/channel-dropdown";
import style from "./logging.module.scss";
import { useEffect, useState } from "react";

const LoggingModule = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [channel, setChannel] = useState<string>("");
  const [events, setEvents] = useState<string>("");
  const [raw_events, setRawEvents] = useState<any>({});

  useEffect(() => {
    (async () => {
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  const onChange = (channel_id: string) => {
    setChannel(channel_id);
  }

  return (
    <>
      <h3>Logging</h3>
      <span>
        Log user, guild, admin, and other events to a specified channel
      </span>
      <section>
        <h4>Events</h4>
        <div className={style.events}>
          <section className={style.event}>
            <label>Joins</label>
            <input type="checkbox" />
          </section>
          <section className={style.event}>
            <label>Leaves</label>
            <input type="checkbox" />
          </section>
          <section className={style.event}>
            <label>Role Changes</label>
            <input type="checkbox" />
          </section>
          <section className={style.event}>
            <label>Channel Updates</label>
            <input type="checkbox" />
          </section>
          <section className={style.event}>
            <label>Server Updates</label>
            <input type="checkbox" />
          </section>
          <section className={style.event}>
            <label>Message Management</label>
            <input type="checkbox" />
          </section>
        </div>
      </section>
      <section>
        <h4>Channel</h4>
        <ChannelDropdown on_change={onChange} guild_id={props.guild_id} />
      </section>
    </>
  );
};

export default LoggingModule;
