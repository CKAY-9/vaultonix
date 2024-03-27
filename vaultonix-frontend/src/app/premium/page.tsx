import { Metadata } from "next";
import PremiumClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Premium - Vaultonix",
    description: "Learn about Vaultonix Premium and it's benefits.",
  };
};

const PremiumPage = () => {
  return (
    <>
      <PremiumClient />
    </>
  );
};

export default PremiumPage;
