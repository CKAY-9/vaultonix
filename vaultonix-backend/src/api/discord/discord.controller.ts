import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { GetGuildDTO } from "./discord.dto";
import { Response, Request } from "express";
import axios from "axios";
import { DISCORD_API } from "src/resources";

@Controller("")
export class DiscordController {
	@Get("/guild_roles")
	async getGuildRoles(@Req() request: Request, @Query() query: GetGuildDTO, @Res() response: Response) {
		try {
			const guilds = await axios({
				"url": DISCORD_API + `/guilds/${query.guild_id}/roles`,
				"method": "GET",
				"headers": {
					"Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`
				}
			});
			return response.status(200).json(guilds.data);
		} catch (ex) {
			console.log(ex);
			return response.status(HttpStatus.BAD_REQUEST).json({"message": "Failed to get roles."});
		}
	}
}