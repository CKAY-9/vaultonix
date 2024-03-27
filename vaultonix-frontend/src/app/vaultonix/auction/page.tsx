import { Metadata } from "next";
import AuctionClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Auction House - Vaultonix",
    description: "Buy/Sell on the official Vaultonix Auction House."
  }
}

const AuctionPage = () => {
  return (
    <>
      <AuctionClient />
    </>
  );
}

export default AuctionPage;