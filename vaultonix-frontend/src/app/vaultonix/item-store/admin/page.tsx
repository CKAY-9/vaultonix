import { getUserFromToken, getUserStaff } from "@/api/user/user.api";
import { getServerCookie } from "@/api/user/user.utils";
import { redirect } from "next/navigation";
import ItemStoreAdminClient from "./client";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Item Store Admin - Vaultonix",
    description: "Manage Vaultonix's Item Store.",
  };
};

const ItemStoreAdminPage = async () => {
  const user = await getUserFromToken(getServerCookie("user_token"));
  if (user === null) {
    redirect("/vaultonix/login");
  }

  const staff = await getUserStaff(user.id);
  if (staff === null) {
    redirect("/vaultonix/item-store");
  }

  // TODO: Check staff permissions

  return (
    <>
      <ItemStoreAdminClient user={user} />
    </>
  );
};

export default ItemStoreAdminPage;
