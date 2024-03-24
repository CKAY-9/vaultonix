"use client"

import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import GuildSelector from "@/components/guild-selector/guild-selector";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import { getCookie } from "@/utils/cookie";
import { useEffect, useState } from "react";

const DashboardClient = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [current_guild, setCurrentGuild] = useState<string>(""); 

	useEffect(() => {
		(async () => {
			if (typeof(window) === undefined) {
				return;
			}

			const discord = window.sessionStorage.getItem("discord_token");
			const token = getCookie("user_token");
			if (discord === null || token === null || token === undefined) {
				window.location.href = "/vaultonix/login"
			}

			const u = await getUserFromToken(token);
			setUser(u);
			setLoading(false);
		})();
	}, []);

	if (loading || user === null) {
		return (<Loading />);
	}

	const changeCurrentGuild = (guild_id: string) => {
		setCurrentGuild(guild_id);
	}

	return (
		<>
			<Header user={user} />
			<main className="container">
				<div className="grid">
					<div className="item">
						<span style={{"fontWeight": "100"}}>Logged in as {user.username}</span>
						<h1>Dashboard</h1>
						<GuildSelector on_guild_select={changeCurrentGuild} />
					</div>
					<div className="item">
						{current_guild.length <= 0 && <span>No Guild Selected!</span>}
					</div>
				</div>
			</main>
		</>
	);
}

export default DashboardClient;