import { Metadata } from "next";
import IndexClient from "./client";
import { getUserFromToken } from "@/api/user/user.api";
import { getServerCookie } from "@/api/server-cookies";

export const generateMetadata = (): Metadata => {
  return {
    title: "Home - Vaultonix",
    description: "Learn about Vaultonix and what is offers."
  };
};

const IndexPage = async () => {
  const user = await getUserFromToken(getServerCookie("user_token"));

  return (
    <>
      <IndexClient user={user} />
    </>
  );
};

export default IndexPage;
