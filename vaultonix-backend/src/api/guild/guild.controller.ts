import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { prisma } from "../prisma";
import { GuildIDDTO } from "./guild.dto";

@Controller("")
export class GuildController {
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