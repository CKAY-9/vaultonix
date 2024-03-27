import { Metadata } from "next";
import VaultonixClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "App - Vaultonix",
    openGraph: {
      images: ["/Banner.png"],
    },
  };
};

const VaultonixIndex = () => {
  return (
    <>
      <VaultonixClient />
    </>
  );
};

export default VaultonixIndex;
