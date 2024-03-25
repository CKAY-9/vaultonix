"use client"

import { useEffect, useState } from "react";
import style from "./index.module.scss";
import Link from "next/link";
import Loading from "@/components/loading/loading";
import Image from "next/image";
import { DISCORD_INVITE } from "@/api/resources";
import Header from "@/components/header/header";
import { UserDTO } from "@/api/user/user.dto";

interface BallPosition {
	x: number,
	y: number
}

const IndexClient = (props: {
	user: UserDTO
}) => {
	const [ball_positions, setBallPositions] = useState<BallPosition[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const splash = document.getElementById("splash");
		if (splash === null) {
			return;
		}

		let max = 20;
		for (let i = 0; i < max; i++) {
			let random_x = (i * max / 2) - (max / 2);
			let random_y = (Math.random() * 3) - 5;

			setBallPositions((old) => [...old, { x: random_x, y: random_y }]);
		}

		setLoading(false);
	}, []);
	return (
		<>
			<div style={{ "display": loading ? "block" : "none" }}>
				<Loading />
			</div>
			<div style={{ "display": loading ? "none" : "grid" }}>
				<Header user={props.user} />
			</div>
			<div className={style.splash} id="splash" style={{ "display": loading ? "none" : "grid" }}>
				<div className={style.content}>
					<div>
						<Image
							src="/Logo.png"
							alt="Logo"
							sizes="100%"
							width={0}
							height={0}
							style={{"width": "75%", "height": "auto"}}
						/>
					</div>
					<h1>VAULTONIX</h1>
					<span>A Trading and Games Discord Bot</span>
					<div style={{"display": "flex", "flexWrap": "wrap", "gap": "1rem", "alignItems": "center", "justifyContent": "center"}}>
						{DISCORD_INVITE !== undefined && 
							<Link href={DISCORD_INVITE} style={{
								"fontWeight": "800", 
								"textTransform": "uppercase", 
								"padding": "1rem", 
								"borderRadius": "0.5rem", 
								"backgroundColor": "var(--primary-300)",
								"color": "inherit !important"
							}} target="_blank">
								Invite Vaultonix to your Server
							</Link>
						}
					</div>
					{ball_positions.map((ball: BallPosition, index: number) => {
						return (
							<div key={index} className={style.ball} style={{ "left": `${ball.x}%`, "bottom": `${ball.y}%`, "borderRadius": `${50 - (ball.y - ball.x)}%` }}></div>
						)
					})}
				</div>
			</div>
			<main className={style.container} style={{ "display": loading ? "none" : "flex" }}>
				<section style={{ "width": "50%" }}>
					<h1>What is Vaultonix?</h1>
					<p>
						Vaultonix is a free and open-source Discord bot that aims to provide a fun and engaging expierence.
						This is done through mini-games, trading, card-opening, and all without needing to spend real money.
						Although this is meant to just be for fun, you can always try to see who can get the best items, most money,
						or the most wins.
					</p>
				</section>
				<section style={{ "width": "50%", "marginLeft": "auto", "textAlign": "right" }}>
					<h1>How do I use Vaultonix?</h1>
					<p>
						Vaultonix can be interacted either through the website (here), or a Discord server that has
						Vaultonix. Individual Discord communities can decide whether or not they want to use your global stats
						or have per server stats.
					</p>
				</section>
				<section style={{ "width": "50%" }}>
					<h1>Is there any P2W?</h1>
					<p>
						Vaultonix does contain P2W mechanics and rewards; however, they are also accessible by just checking Vaultonix
						every once and a while. For example, 5 1-day XP booster is $2 or you can spend 10,000 credits.
					</p>
				</section>
				<section style={{ "marginTop": "5rem", "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
					<Link href="/vaultonix"><h1>ENTER VAULTONIX</h1></Link>
				</section>
			</main>
		</>
	);
}

export default IndexClient;