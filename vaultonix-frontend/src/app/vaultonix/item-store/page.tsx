import { Metadata } from "next";
import ItemStoreClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Item Store - Vaultonix",
    description: "Purchase Items from the Official Vaultonix Item Store",
  };
};

const ItemStorePage = () => {
  return (
    <>
      <ItemStoreClient />
    </>
  );
};

export default ItemStorePage;
