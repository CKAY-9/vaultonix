import { Metadata } from "next";
import GuildDashboardClient from "./client";

export const generateMetadata = (): Metadata => {
	return {
		"title": "Guild Dashboard - Vaultonix",
		"description": "Manage this guild on Vaultonix."
	}
}

const GuildPage = async ({params}: {
	params: {
		guild_id: string
	}
}) => {
	return (
		<>
			<GuildDashboardClient guild_id={params.guild_id} />
		</>
	);
}

export default GuildPage;