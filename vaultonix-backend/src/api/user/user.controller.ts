import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import {
  DiscordCodeDTO,
  DiscordInitialDTO,
  DiscordUserDTO,
  GetGuildUserDTO,
  GetUserDTO,
} from './user.dto';
import axios, { AxiosResponse } from 'axios';
import {
  DISCORD_API,
  DISCORD_CDN,
  FRONTEND_HOST,
  LOCAL_HOST,
} from 'src/resources';
import { prisma } from '../prisma';
import { SHA256 } from 'crypto-js';
import { initializeGuildUser } from './user.utils';

@Controller('')
export class UserController {
  @Get('')
  async getPersonalUser(@Req() request: Request, @Res() response: Response) {
    try {
      const user_token = request.headers.authorization;
      const user = await prisma.users.findFirst({
        where: {
          token: user_token || '',
        },
      });
      return response.status(200).json(user);
    } catch (ex) {
      console.log(ex);
      return response.status(HttpStatus.BAD_REQUEST).json({ message: ex });
    }
  }

  @Get('/public')
  async getPublicUser(
    @Req() request: Request,
    @Query() query: GetUserDTO,
    @Res() response: Response,
  ) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: Number.parseInt(query.user_id.toString()),
        },
        select: {
          avatar_url: true,
          discord_id: true,
          id: true,
          joined: true,
          supporter: true,
          username: true,
        },
      });
      return response.status(200).json(user);
    } catch (ex) {
      console.log(ex);
      return response.status(HttpStatus.BAD_REQUEST).json({ message: ex });
    }
  }

  @Get('/login')
  async login(
    @Req() request: Request,
    @Query() query: DiscordCodeDTO,
    @Res() response: Response,
  ) {
    try {
      const initial_request: AxiosResponse<DiscordInitialDTO> = await axios({
        url: DISCORD_API + '/oauth2/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          grant_type: 'authorization_code',
          code: query.code,
          redirect_uri: process.env.LOCAL_HOST + '/api/v1/user/login',
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
        },
      });

      const user_request: AxiosResponse<DiscordUserDTO> = await axios({
        url: DISCORD_API + '/users/@me',
        method: 'GET',
        headers: {
          Authorization: `${initial_request.data.token_type} ${initial_request.data.access_token}`,
        },
      });
      if (user_request.status !== 200) {
        return response.redirect(
          process.env.FRONTEND_HOST + '/vaultonix/login',
        );
      }

      const user_check = await prisma.users.findFirst({
        where: {
          discord_id: user_request.data.id,
        },
      });
      if (user_check !== null) {
        await prisma.users.update({
          where: {
            id: user_check.id,
          },
          data: {
            avatar_url:
              DISCORD_CDN +
              `/avatars/${user_request.data.id}/${user_request.data.avatar}`,
            username: user_request.data.global_name,
          },
        });

        return response.redirect(
          process.env.FRONTEND_HOST +
            `/vaultonix/login?token=${user_check.token}&discord=${initial_request.data.access_token}`,
        );
      }

      const token = SHA256(
        (Math.random() * Number.MAX_SAFE_INTEGER).toString() +
          new Date().toISOString() +
          user_request.data.id,
      ).toString();
      const insert = await prisma.users.create({
        data: {
          avatar_url:
            DISCORD_CDN +
            `/avatars/${user_request.data.id}/${user_request.data.avatar}`,
          username: user_request.data.global_name,
          token: token,
          discord_id: user_request.data.id,
        },
      });

      return response.redirect(
        process.env.FRONTEND_HOST +
          `/vaultonix/login?token=${token}&discord=${initial_request.data.access_token}`,
      );
    } catch (ex: any) {
      console.log(ex);
      return response.redirect(process.env.FRONTEND_HOST + '/vaultonix/login');
    }
  }

  @Get('/staff')
  async getUserStaff(
    @Req() request: Request,
    @Query() query: GetUserDTO,
    @Res() response: Response,
  ) {
    const staff = await prisma.staff.findFirst({
      where: {
        user_id: Number.parseInt(query.user_id.toString() || '0'),
      },
    });
    if (staff === null) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Couldn't find staff priveledges." });
    }
    return response.status(200).json(staff);
  }

  @Get('/guild')
  async getGuildUser(
    @Req() request: Request,
    @Query() query: GetGuildUserDTO,
    @Res() response: Response,
  ) {
    let guild_user = await prisma.guildUsers.findFirst({
      where: {
        guild_id: query.guild_id,
        user_id: query.user_id,
      },
    });
    if (guild_user === null) {
      guild_user = await initializeGuildUser(query.guild_id, query.user_id);
    }

    return response.status(200).json(guild_user);
  }

  @Get('/discord')
  async convertDiscordIDToVaultonix(
    @Req() request: Request,
    @Query() query: GetGuildUserDTO,
    @Res() response: Response,
  ) {
    try {
      const request = await axios({
        url: DISCORD_API + `/guilds/${query.guild_id}/members/${query.user_id}`,
        method: 'GET',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });
      return response.status(200).json(request.data);
    } catch (ex) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Failed to get Discord user.' });
    }
  }

  @Get('/trades')
  async getUserTrades(
    @Req() request: Request,
    @Query() query: GetGuildUserDTO,
    @Res() response: Response,
  ) {
    const personal_trades = await prisma.guildTrade.findMany({
      where: {
        guild_id: query.guild_id,
        user_id: query.user_id,
      },
    });
    const partner_trades = await prisma.guildTrade.findMany({
      where: {
        guild_id: query.guild_id,
        partner_id: query.user_id,
      },
    });
    const final_array = partner_trades.concat(personal_trades);
    return response.status(200).json(final_array);
  }
}
