import { cookies } from "next/headers";

export const getServerCookie = (cookie: string) => {
	const c = cookies();
	const token = c.get("user_token")?.value;
    return token;
}