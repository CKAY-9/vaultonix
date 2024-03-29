import { Metadata } from "next";
import VaultonixClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "App - Vaultonix",
    description: "Manage your Vaultonix expierence."
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
