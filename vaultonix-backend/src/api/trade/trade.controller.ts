import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { GetTradeDTO, NewTradeDTO } from './trade.dto';

@Controller('')
export class TradeController {
  @Post('')
  async createNewTrade(
    @Req() request: Request,
    @Body() body: NewTradeDTO,
    @Res() response: Response,
  ) {
    const token = request.headers.authorization;
    if (token === null) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Failed to get token.' });
    }

    let flag = token === process.env.BOT_AUTH_KEY;
    if (!flag) {
      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (user === null) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Failed to get user.' });
      }

      if (user.discord_id !== body.user_id) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Guild and Vaultonix user data didn't match." });
      }

      flag = true;
    }

    if (!flag) {
      const user_check = await prisma.guildUsers.findFirst({
        where: {
          guild_id: body.guild_id,
          user_id: body.user_id,
        },
      });
      if (user_check === null) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Failed to find user.' });
      }
    }

    const partner_check = await prisma.guildUsers.findFirst({
      where: {
        guild_id: body.guild_id,
        user_id: body.partner_id,
      },
    });
    if (partner_check === null) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to find partner.' });
    }

    const insert = await prisma.guildTrade.create({
      data: {
        guild_id: body.guild_id,
        partner_id: body.partner_id,
        user_id: body.user_id,
      },
    });
    return response.status(200).json(insert);
  }

  @Get('')
  async getTradeOffer(
    @Req() request: Request,
    @Query() query: GetTradeDTO,
    @Res() response: Response,
  ) {
    const trade_offer = await prisma.guildTrade.findFirst({
      where: {
        id: Number.parseInt(query.trade_id.toString()),
      },
    });
    if (trade_offer === null) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to get trade offer.' });
    }

    return response.status(200).json(trade_offer);
  }
}
