import { getUserFromToken } from "@/api/user/user.api";
import { getServerCookie } from "@/api/user/user.utils";
import Header from "@/components/header/header";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
	return {
		title: "News - Vaultonix",
		description: "Learn about the news surrounding Vaultonix and it's development."
	}
}

const NewsPage = async () => {
	const user = await getUserFromToken(getServerCookie("user_token"));
	
	return (
		<>
			<Header user={user} />
			<main className="container">
				<section>
					<h1>Vaultonix News</h1>
					<span style={{ "fontWeight": "100" }}>Keep up to date with Vaultonix and everything around it.</span>
				</section>
			</main>
		</>
	);
}

export default NewsPage;