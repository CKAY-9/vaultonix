import { Metadata } from "next";
import TradeOfferClient from "./client";
import { getTradeFromID } from "@/api/vaultonix/vaultonix.api";
import { getUserFromDiscord } from "@/api/discord/discord.api";
import { getUserFromVaultonix } from "@/api/user/user.api";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const t = await getTradeFromID(Number.parseInt(params.id));
  if (t !== null) {
    const u = await getUserFromVaultonix(t.user_id, t.guild_id);
    const p = await getUserFromVaultonix(t.partner_id, t.guild_id);
    return {
      title: `Trade Offer between ${u?.user.global_name || ""} and ${p?.user.global_name || ""} - Vaultonix`,
      description: `View this trade offer between ${u?.user.global_name || ""} and ${p?.user.global_name || ""}.`
    }
  }

  return {
    title: "Trade Offer - Vaultonix",
    description: "View this trade offer on Vaultonix"
  };
}

const TradeOfferPage = ({params}: {
  params: {
    id: string
  }
}) => {
  return (
    <>
      <TradeOfferClient trade_id={Number.parseInt(params.id)} />
    </>
  );
}

export default TradeOfferPage;