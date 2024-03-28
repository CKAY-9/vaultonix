import { Metadata } from "next";
import InventoryClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Inventory - Vaultonix",
    description: "View your available inventories on Vaultonix."
  }
}

const InventoryPage = () => {
  return (
    <>
      <InventoryClient />
    </>
  );
}

export default InventoryPage;