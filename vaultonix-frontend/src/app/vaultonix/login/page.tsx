import { Metadata } from "next";
import LoginClient from "./client";

export const generateMetadata = (): Metadata => {
	return {
		"title": "Login - Vaultonix"
	}
}

const LoginPage = () => {
	return (
		<>
			<LoginClient />
		</>
	);
}

export default LoginPage;