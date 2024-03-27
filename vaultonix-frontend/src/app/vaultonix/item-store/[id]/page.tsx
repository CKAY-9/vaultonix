import { Metadata } from "next";
import StoreItemClient from "./client";
import { getStoreItem } from "@/api/store/store.api";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const item = await getStoreItem(Number.parseInt(params.id));
  if (item !== null) {
    return {
      title: `${item.name} - Vaultonix`,
      description: `${item.description}`
    }
  }

  return {
    title: "Item - Vaultonix",
    description: "View this item on Vaultonix's Official Item Store."
  }
}

const StoreItemPage = ({params}: {
  params: {
    id: string
  }
}) => {
  return (
    <>
      <StoreItemClient item_id={params.id} />
    </>
  );
}

export default StoreItemPage;