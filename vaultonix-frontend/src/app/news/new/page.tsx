import { getUserFromToken, getUserStaff } from "@/api/user/user.api";
import { getServerCookie } from "@/api/user/user.utils";
import { redirect } from "next/navigation";
import NewArticleClient from "./client";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "New Article - Vaultonix",
    description: "Create a new news article on Vaultonix News.",
  };
};

const NewArticlePage = async () => {
  const user = await getUserFromToken(getServerCookie("user_token"));
  const staff = await getUserStaff(user.id || 0);
  if (user === null || staff === null) {
    redirect("/news");
  }

  return (
    <>
      <NewArticleClient staff={staff} user={user} />
    </>
  );
};

export default NewArticlePage;
