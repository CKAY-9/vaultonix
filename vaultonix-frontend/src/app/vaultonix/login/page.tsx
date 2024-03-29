import { Metadata } from "next";
import LoginClient from "./client";
import { Suspense } from "react";

export const generateMetadata = (): Metadata => {
  return {
    title: "Login - Vaultonix",
    description: "Login to your Discord account to use Vaultonix"
  };
};

const LoginPage = () => {
  return (
    <>
      <Suspense>
        <LoginClient />
      </Suspense>
    </>
  );
};

export default LoginPage;
