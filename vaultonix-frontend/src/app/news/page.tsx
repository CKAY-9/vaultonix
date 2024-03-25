import { getUserFromToken, getUserStaff } from "@/api/user/user.api";
import { getServerCookie } from "@/api/user/user.utils";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import Link from "next/link";

export const generateMetadata = (): Metadata => {
	return {
		title: "News - Vaultonix",
		description: "Learn about the news surrounding Vaultonix and it's development.",
		"openGraph": {
			"images": ["/Banner.png"]
		}
	}
}

const NewsPage = async () => {
	const user = await getUserFromToken(getServerCookie("user_token"));
	const staff = await getUserStaff(user.id || 0);
	
	return (
		<>
			<Header user={user} />
			<main className="container">
				{staff !== null &&
					<Link href="/news/new">New Article</Link>
				}
				<section>
					<h1>Vaultonix News</h1>
					<span style={{ "fontWeight": "100" }}>Keep up to date with Vaultonix and everything around it.</span>
				</section>
			</main>
			<Footer />
		</>
	);
}

export default NewsPage;