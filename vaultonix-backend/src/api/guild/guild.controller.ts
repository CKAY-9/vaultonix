import { Body, Controller, Get, HttpStatus, Put, Query, Req, Res } from "@nestjs/common";
import { Response, Request, response, query } from "express";
import { prisma } from "../prisma";
import { GuildIDDTO, UpdateAutoRolesDTO, UpdateWelcomeGoodbyeDTO } from "./guild.dto";
import { initialServerData, initialWelcomeGoodbye, initializeLevelRewards } from "../bot/bot.utils";
import { GetGuildDTO } from "../bot/bot.dto";

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

	@Get("/welcome_goodbye")
	async getWelcomeGoodbyeMessage(@Req() request: Request, @Query() query: GetGuildDTO, @Res() response: Response) {
		let guild_welcome_goodbye = await prisma.guildWelcomeGoodbye.findFirst({
			where: {
				"guild_id": query.guild_id
			}
		});
		if (guild_welcome_goodbye === null) {
			guild_welcome_goodbye = await initialWelcomeGoodbye(query.guild_id);
		}

		return response.status(200).json(guild_welcome_goodbye);
	}

	@Put("/welcome_goodbye")
	async updateWelcomeGoodbyeMessage(@Req() request: Request, @Body() body: UpdateWelcomeGoodbyeDTO, @Res() response: Response) {
		let guild_welcome_goodbye = await prisma.guildWelcomeGoodbye.findFirst({
			where: {
				"guild_id": body.guild_id
			}
		});
		if (guild_welcome_goodbye === null) {
			guild_welcome_goodbye = await initialWelcomeGoodbye(body.guild_id);
		}

		const update = await prisma.guildWelcomeGoodbye.update({
			where: {
				"id": guild_welcome_goodbye.id
			},
			data: {
				"welcome": body.welcome,
				"goodbye": body.goodbye,
				"channel_id": body.channel_id,
				"enabled": body.enabled
			}
		});
		return response.status(200).json({"message": "Updated Welcome Goodbye."});
	}

	@Get("/levels")
	async getRewardLevels(@Req() request: Request, @Query() query: GetGuildDTO, @Res() response: Response) {
		let levels = await prisma.guildLevelRewards.findFirst({
			where: {
				"guild_id": query.guild_id
			}
		});
		if (levels === null) {
			levels = await initializeLevelRewards(query.guild_id);
		}
		
		return response.status(200).json(levels);
	}
}