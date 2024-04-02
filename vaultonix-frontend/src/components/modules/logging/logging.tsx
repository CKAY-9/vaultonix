"use client";

import { useEffect, useState } from "react";

const LoggingModule = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <>
      <h3>Logging</h3>
      <span>
        Log user, guild, admin, and other events in a specified channel.
      </span>
    </>
  );
};

export default LoggingModule;
