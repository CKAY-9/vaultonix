"use client"

import { getGuildConfig, getMyGuilds, getVaultonixActiveGuilds } from "@/api/discord/discord.api";
import { GuildDTO, GuildSettingsDTO } from "@/api/discord/discord.dto";
import { getUserFromToken } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import Header from "@/components/header/header";
import Loading from "@/components/loading/loading";
import AutoRolesModule from "@/components/modules/auto-roles/auto-roles";
import WelcomeGoodbyeModule from "@/components/modules/welcome-goodbye/welcome-goodbye";
import { getCookie } from "@/utils/cookie";
import Image from "next/image";
import { useEffect, useState } from "react";

const GuildDashboardClient = (props: {
	guild_id: string
}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [guild, setGuild] = useState<GuildDTO | null>(null);
	const [is_active, setIsActive] = useState<boolean>(false);
	const [config, setConfig] = useState<GuildSettingsDTO | null>(null);

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
			if (u === null) {
				window.location.href = "/vaultonix/";
			}
			const guilds = await getMyGuilds();
			for (let i = 0; i < guilds.length; i++) {
				const g = guilds[i];
				if (g.id === props.guild_id) {
					setGuild(g);
					break;
				}
			}

			const conf = await getGuildConfig(props.guild_id);

			setUser(u);
			setConfig(conf);
			setLoading(false);
		})();
	}, [props.guild_id]);

	if (loading || user === null) {
		return (<Loading />);
	}

	if (guild === null || config === null) {
		return window.location.href = "/vaultonix/dashboard";
	}

	return (
		<>
			<Header user={user} />
			<main className="container">
				<div className="grid" style={{"gridTemplateColumns": "65% auto"}}>
					<div className="item">
						<h1>{guild.name}</h1>
					</div>
					<div className="item">
						<section style={{ "display": "flex", "alignItems": "center", "gap": "0.5rem" }}>
							<h3>Information</h3>
							<Image
								src="/stats.svg"
								alt="Stats"
								sizes="100%"
								width={0}
								height={0}
								style={{ "width": "2rem", "height": "2rem", "filter": "invert(1)" }}
							/>
						</section>
						<span>{guild.approximate_member_count || 1} Members</span>
						<span>Owner: {guild.owner ? "YES" : "NO"}</span>
						<span>Guild ID: {guild.id}</span>
					</div>
				</div>
				<div className="grid">
					<div className="item">
						<h2>Modules</h2>
						<span>Modules are small parts of Vaultonix that offer more functionality. Each can be enabled and disabled to your liking</span>
					</div>
				</div>
				<div className="grid" style={{"gridTemplateColumns": "55% auto"}}>
					<div className="item">
						<AutoRolesModule guild_id={props.guild_id} />
					</div>
					<div className="item">
						<WelcomeGoodbyeModule />
					</div>
				</div>
				<div className="grid" style={{"gridTemplateColumns": "auto 55%"}}>
					<div className="item">
						<h3>Level Rewards</h3>
						<span>Reward users for reaching certain levels</span>
					</div>
					<div className="item" style={{"opacity": user.supporter ? "1" : "0.75"}}>
						<h3 className="rainbow">SERVER WIDE BOOSTERS</h3>
						<span>Bless your server with XP and Credit boosters</span>						
						{!user.supporter && <span>Premium Feature</span>}
					</div>
				</div>
				<div className="grid" style={{"gridTemplateColumns": "auto 60%"}}>
					<div className="item" style={{"opacity": user.supporter ? "1" : "0.75"}}>
						<h3 className="rainbow">MINECRAFT TO DISCORD CHAT</h3>
						<span>Enable real-time chat between your Discord and Minecraft servers</span>						
						{!user.supporter && <span>Premium Feature</span>}
					</div>
					<div className="item">
						<h3>Trading</h3>
						<span>Allow users to trade their items with eachother</span>
					</div>
				</div>
				<div className="grid" style={{"gridTemplateColumns": "auto 50%"}}>
					<div className="item">
						<h3>Trivia Bot</h3>
						<span>Reward users for getting correct answers to Trivia questions</span>
					</div>
					<div className="item" style={{"opacity": user.supporter ? "1" : "0.75"}}>
						<h3 className="rainbow">GLOBAL TRADING</h3>
						<span>Allow users to trade with users in other Discord communities.</span>						
						{!user.supporter && <span>Premium Feature</span>}
					</div>
				</div>
			</main>
		</>
	);
}

export default GuildDashboardClient;