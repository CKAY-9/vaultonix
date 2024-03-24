"use client"

import { DISCORD_OAUTH_LINK } from "@/api/oauth";
import style from "./login.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { setCookie } from "@/utils/cookie";

const LoginClient = () => {
	const search_params = useSearchParams();
	const token = search_params.get("token");
	const discord = search_params.get("discord");
	if (token !== null && discord !== null) {
	  setCookie("user_token", token, 999);
		window.sessionStorage.setItem("discord_token", discord);
	  window.location.href = "/vaultonix"
	}

	return (
		<>
			<div className={style.login}>
				<div className={style.content}>
					{DISCORD_OAUTH_LINK !== undefined &&
						<Link href={DISCORD_OAUTH_LINK}>
							<Image
								src="/discord-mark-white.svg"
								alt="Discord"
								sizes="100%"
								width={0}
								height={0}
							/>
							<h4>Login with Discord</h4>
						</Link>
					}
					<Link href="/" style={{"background": "none", "padding": "0"}}>Back</Link>
				</div>
			</div>
		</>
	);
}

export default LoginClient;