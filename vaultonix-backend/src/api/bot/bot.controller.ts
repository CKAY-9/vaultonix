import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request, response } from 'express';
import { prisma } from '../prisma';
import { GetGuildDTO, NewServerDTO, UpdateXPDTO } from './bot.dto';
import { addXPToUser, initializeGuildUser } from '../user/user.utils';

@Controller('')
export class BotController {
  @Post('/guild')
  async botJoinedServer(
    @Req() req: Request,
    @Body() body: NewServerDTO,
    @Res() res: Response,
  ) {
    const check_previous = await prisma.guilds.findFirst({
      where: {
        guild_id: body.guild_id,
      },
    });
    if (check_previous !== null) {
      const update = await prisma.guilds.update({
        where: {
          id: check_previous.id,
        },
        data: {
          guild_id: body.guild_id,
          guild_owner: body.guild_owner,
          guild_name: body.guild_name
        }
      })

      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Guild already registered!' });
    }

    const insert = await prisma.guilds.create({
      data: {
        guild_name: body.guild_name,
        guild_id: body.guild_id,
        guild_owner: body.guild_owner,
      },
    });
    return res.status(200).json({ message: 'Registered guild!' });
  }

  @Delete('/guild')
  async deleteGuild(
    @Req() req: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    const check = await prisma.guilds.findFirst({
      where: {
        guild_id: query.guild_id,
      },
    });
    if (check === null) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to find guild.' });
    }

    const delete_guild = await prisma.guilds.delete({
      where: {
        id: check.id,
        guild_id: query.guild_id,
      },
    });
    return response.status(200).json({ message: 'Deleted guild.' });
  }

  @Put('/xp')
  async updateUserXP(
    @Req() request: Request,
    @Body() body: UpdateXPDTO,
    @Res() response: Response,
  ) {
    let user = await prisma.guildUsers.findFirst({
      where: {
        user_id: body.user_id,
        guild_id: body.guild_id,
      },
    });
    if (user == null) {
      user = await initializeGuildUser(body.guild_id, body.user_id);
    }

    const update = await addXPToUser(user, body.xp_change);
    return response.status(200).json(update);
  }
}
