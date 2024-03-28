import { getUserFromToken, getUserStaff } from "@/api/user/user.api";
import { redirect } from "next/navigation";
import NewArticleClient from "./client";
import { Metadata } from "next";
import { getServerCookie } from "@/api/server-cookies";

export const generateMetadata = (): Metadata => {
  return {
    title: "New Article - Vaultonix",
    description: "Create a new news article on Vaultonix News.",
  };
};

const NewArticlePage = async () => {
  const user = await getUserFromToken(getServerCookie("user_token"));
  if (user === null) {
    redirect("/news");
  }
  const staff = await getUserStaff(user.id || 0);
  if (staff === null) {
    redirect("/news");
  }

  return (
    <>
      <NewArticleClient staff={staff} user={user} />
    </>
  );
};

export default NewArticlePage;
