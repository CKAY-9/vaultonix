import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { prisma } from "../prisma";
import { GuildIDDTO } from "./guild.dto";
import { initialServerData } from "../bot/bot.utils";

@Controller("")
export class GuildController {
	@Get("")
	async getGuildFromID(@Req() request: Request, @Query() query: GuildIDDTO, @Res() response: Response) {
		try {
			const guild = await prisma.guilds.findFirst({
				where: {
					"guild_id": query.guild_id || ""
				}
			});
			if (guild === null) {
				return response.status(HttpStatus.NOT_FOUND).json({"message": "Guild is not active with the power of Vaultonix."});
			}
			const config = await prisma.guildSettings.findFirst({
				where: {
					"guild_id": query.guild_id
				}
			});
			if (config === null) {
				await initialServerData(query.guild_id);
			}
			return response.status(HttpStatus.OK).json(guild);
		} catch (ex) {
			console.log(ex);
			return response.status(HttpStatus.BAD_REQUEST).json({"message": ex});
		}
	}

	@Get("/config")
	async getServerConfig(@Req() req: Request, @Query() query: GuildIDDTO, @Res() res: Response) {
			let config = await prisma.guildSettings.findMany({
					where: {
							"guild_id": query.guild_id
					}
			});
			if (config === null) {
					const re = await initialServerData(query.guild_id);
					config = re.config;
			}
			return res.status(200).json(config);
	}

	@Get("/registered")
	async isGuildRegistered(@Req() request: Request, @Query() query: GuildIDDTO, @Res() response: Response) {
		try {
			const guild = await prisma.guilds.findFirst({
				where: {
					"guild_id": query.guild_id || ""
				}
			});
			if (guild === null) {
				return response.status(HttpStatus.NOT_FOUND).json({"message": "Guild is not active with the power of Vaultonix."});
			}
			return response.status(HttpStatus.OK).json({"message": "Server Registered"});
		} catch (ex) {
			console.log(ex);
			return response.status(HttpStatus.BAD_REQUEST).json({"message": ex});
		}
	}
}