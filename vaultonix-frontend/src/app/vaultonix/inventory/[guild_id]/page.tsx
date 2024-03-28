import { Metadata } from "next";
import GuildInventoryClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Inventory - Vaultonix",
    description: "View your inventory on this guild."
  }
}

const GuildInventoryPage = ({params}: {
  params: {
    guild_id: string
  }
}) => {
  return (
    <>
      <GuildInventoryClient guild_id={params.guild_id} />
    </>
  );
}

export default GuildInventoryPage;