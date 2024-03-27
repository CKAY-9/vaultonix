import { Metadata } from "next";
import UserClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "User - Vaultonix",
    description: "View this user's profile on Vaultonix.",
  };
};

const UserPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <>
      <UserClient user_id={Number.parseInt(params.id || "0")} />
    </>
  );
};

export default UserPage;
