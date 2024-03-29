import { Metadata } from "next";
import TradeClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Trades - Vaultonix",
    description: "View your trades on Vaultonix"
  }
}

const TradePage = () => {
  return (
    <>
      <TradeClient />
    </>
  );
}

export default TradePage;