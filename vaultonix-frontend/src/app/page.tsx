import { Metadata } from "next";
import IndexClient from "./client";
import { getUserFromToken } from "@/api/user/user.api";
import { getServerCookie } from "@/api/user/user.utils";

export const generateMetadata = (): Metadata => {
  return {
    title: "Home - Vaultonix",
    openGraph: {
      images: ["/Banner.png"],
    },
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
