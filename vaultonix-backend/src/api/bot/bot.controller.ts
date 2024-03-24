import { Body, Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { prisma } from "../prisma";
import { NewServerDTO } from "./bot.dto";

@Controller("")
export class BotController {
    @Post("/new_server")
    async botJoinedServer(@Req() req: Request, @Body() body: NewServerDTO, @Res() res: Response) {
        const check_previous = await prisma.guild.findMany({
            where: {
                "guild_id": body.guild_id
            },
        });
        if (check_previous.length >= 1) {
            return res.status(HttpStatus.FOUND).json({"message": "Guild already registered!"});
        }

        const insert = await prisma.guild.create({
            "data": {
                "guid_name": body.guild_name,
                "guild_id": body.guild_id,
                "guild_owner": body.guild_owner
            }
        });
        return res.status(200).json({"message": "Registered guild!"});
    }
}