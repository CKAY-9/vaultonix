import { Body, Controller, Get, HttpStatus, Put, Query, Req, Res } from "@nestjs/common";
import { Response, Request, response } from "express";
import { prisma } from "../prisma";
import { GuildIDDTO, UpdateAutoRolesDTO } from "./guild.dto";
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
			let config = await prisma.guildSettings.findFirst({
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

	@Put("/auto_roles")
	async updateAutoRoles(@Req() request: Request, @Body() body: UpdateAutoRolesDTO, @Res() response: Response) {
		let guild = await prisma.guildSettings.findFirst({
			where: {
				"guild_id": body.guild_id
			}
		});
		if (guild === null) {
			await initialServerData(body.guild_id);
			guild = await prisma.guildSettings.findFirst({
				where: {
					"guild_id": body.guild_id
				}
			});
		}

		const update = await prisma.guildSettings.update({
			where: {
				"guild_id": body.guild_id,
				"id": guild.id
			},
			data: {
				"join_roles": body.role_ids
			}
		});
		return response.status(200).json({"message": "Updated roles."});
	}
}