import { Metadata } from "next";
import LeaderboardClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Leaderboard - Vaultonix",
    description: "View this guild's leaderboard on Vaultonix."
  }
}

const LeaderboardPage = ({params}: {
  params: {
    guild_id: string
  }
}) => {
  return (
    <>
      <LeaderboardClient guild_id={params.guild_id} />
    </>
  );
}

export default LeaderboardPage;