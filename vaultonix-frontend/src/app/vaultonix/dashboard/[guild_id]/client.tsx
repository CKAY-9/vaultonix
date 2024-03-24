"use client"

import { getGuildFromID, getVaultonixActiveGuilds } from "@/api/discord/discord.api";
import { GuildDTO } from "@/api/discord/discord.dto";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";

const GuildDashboardClient = (props: {
	guild_id: string
}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [guild, setGuild] = useState<GuildDTO | null>(null);
	const [is_active, setIsActive] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			if (typeof(window) === undefined) {
				return;
			}

			const discord_token = window.sessionStorage.getItem("discord_token");
			const user_token = getCookie("user_token");
			if (discord_token === null || user_token === null) {
				window.location.href = "/vaultonix/login";
			}

			const u = await getUserFromToken(user_token);
			const g = await getGuildFromID(props.guild_id);
			if (g === null || u === null) {
				//window.location.href = "/vaultonix/";
			}
			setUser(u);
			setGuild(g);
			setLoading(false);
		})();
	}, []);

	if (loading || user === null) {
		return (<Loading />);
	}

	return (
		<>
			<Header user={user} />
			<main className="container">
				<div className="grid" style={{"gridTemplateColumns": "65% 35%"}}>
					<div className="item">

					</div>
					<div className="item">

					</div>
				</div>
			</main>
		</>
	);
}

export default GuildDashboardClient;