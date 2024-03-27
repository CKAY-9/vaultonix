import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { prisma } from "../prisma";
import { GetGuildDTO, NewServerDTO } from "./bot.dto";
import { initialServerData } from "./bot.utils";

@Controller("")
export class BotController {
    @Post("/guild")
    async botJoinedServer(@Req() req: Request, @Body() body: NewServerDTO, @Res() res: Response) {
        const check_previous = await prisma.guilds.findMany({
            where: {
                "guild_id": body.guild_id
            },
        });
        if (check_previous.length >= 1) {
            return res.status(HttpStatus.FOUND).json({"message": "Guild already registered!"});
        }

        const insert = await prisma.guilds.create({
            "data": {
                "guid_name": body.guild_name,
                "guild_id": body.guild_id,
                "guild_owner": body.guild_owner
            }
        });
        return res.status(200).json({"message": "Registered guild!"});
    }

    @Delete("/guild")
    async deleteGuild(@Req() req: Request, @Query() query: GetGuildDTO, @Res() response: Response) {

    }
}