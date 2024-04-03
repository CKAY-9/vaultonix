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
import { Response, Request } from 'express';
import { prisma } from '../prisma';
import {
  GuildIDDTO,
  UpdateAutoRolesDTO,
  UpdateLevelRewardsDTO,
  UpdateTriviaQuestionsDTO,
  UpdateWelcomeGoodbyeDTO,
} from './guild.dto';
import { GetGuildDTO } from '../bot/bot.dto';
import {
  getGuild,
  getGuildSettings,
  getLevelRewards,
  getLogging,
  getTrivia,
  getWelcomeGoodbye,
} from './guild.utils';
import axios from 'axios';
import { DISCORD_API } from 'src/resources';
import { GuildLogging } from '@prisma/client';
import { getGuildOwner } from '../user/user.utils';

@Controller('')
export class GuildController {
  @Get('')
  async getGuildFromID(
    @Req() request: Request,
    @Query() query: GuildIDDTO,
    @Res() response: Response,
  ) {
    try {
      let guild = await getGuild(query.guild_id);
      if (guild === null) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Failed to get guild.' });
      }
      return response.status(HttpStatus.OK).json(guild);
    } catch (ex) {
      console.log(ex);
      return response.status(HttpStatus.BAD_REQUEST).json({ message: ex });
    }
  }

  @Get('/users')
  async getGuildUsers(
    @Req() req: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    const guild_users = await prisma.guildUsers.findMany({
      where: {
        guild_id: query.guild_id,
      },
    });
    return response.status(200).json(guild_users || []);
  }

  @Get('/config')
  async getServerConfig(
    @Req() req: Request,
    @Query() query: GuildIDDTO,
    @Res() res: Response,
  ) {
    let config = await getGuildSettings(query.guild_id);
    return res.status(200).json(config);
  }

  @Get('/registered')
  async isGuildRegistered(
    @Req() request: Request,
    @Query() query: GuildIDDTO,
    @Res() response: Response,
  ) {
    try {
      const guild = await prisma.guilds.findFirst({
        where: {
          guild_id: query.guild_id || '',
        },
      });
      if (guild === null) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Guild is not active with the power of Vaultonix.',
        });
      }
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Server Registered' });
    } catch (ex) {
      console.log(ex);
      return response.status(HttpStatus.BAD_REQUEST).json({ message: ex });
    }
  }

  @Put('/auto_roles')
  async updateAutoRoles(
    @Req() request: Request,
    @Body() body: UpdateAutoRolesDTO,
    @Res() response: Response,
  ) {
    const user = await getGuildOwner(request, body.guild_id);
    if (user === null) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Failed to get user." });
    }

    let guild = await getGuildSettings(body.guild_id);
    const update = await prisma.guildSettings.update({
      where: {
        guild_id: body.guild_id,
        id: guild.id,
      },
      data: {
        join_roles: body.role_ids,
      },
    });
    return response.status(200).json({ message: 'Updated roles.' });
  }

  @Get('/welcome_goodbye')
  async getWelcomeGoodbyeMessage(
    @Req() request: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    let guild_welcome_goodbye = await getWelcomeGoodbye(query.guild_id);
    return response.status(200).json(guild_welcome_goodbye);
  }

  @Put('/welcome_goodbye')
  async updateWelcomeGoodbyeMessage(
    @Req() request: Request,
    @Body() body: UpdateWelcomeGoodbyeDTO,
    @Res() response: Response,
  ) {
    const user = await getGuildOwner(request, body.guild_id);
    if (user === null) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Failed to get user." });
    }

    let guild_welcome_goodbye = await getWelcomeGoodbye(body.guild_id);
    const update = await prisma.guildWelcomeGoodbye.update({
      where: {
        id: guild_welcome_goodbye.id,
      },
      data: {
        welcome: body.welcome,
        goodbye: body.goodbye,
        channel_id: body.channel_id,
        enabled: body.enabled,
      },
    });
    return response.status(200).json({ message: 'Updated Welcome Goodbye.' });
  }

  @Get('/levels')
  async getRewardLevels(
    @Req() request: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    const levels = await getLevelRewards(query.guild_id);
    return response.status(200).json(levels);
  }

  @Put('/levels')
  async updateRewardLevels(
    @Req() request: Request,
    @Body() body: UpdateLevelRewardsDTO,
    @Res() response: Response,
  ) {
    try {
      const user = await getGuildOwner(request, body.guild_id);
      if (user === null) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Failed to get user." });
      }

      let levels = await getLevelRewards(body.guild_id);
      const update = await prisma.guildLevelRewards.update({
        where: {
          guild_id: body.guild_id,
          id: levels.id,
        },
        data: {
          level_json: body.level_rewards.level_json,
          enabled: body.level_rewards.enabled,
        },
      });
      return response.status(200).json(update);
    } catch (ex) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Failed to update Level Rewards.' });
    }
  }

  @Get('/discord')
  async getGuildDiscord(
    @Req() request: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    try {
      const request = await axios({
        url: DISCORD_API + `/guilds/${query.guild_id}`,
        method: 'GET',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });
      return response.status(200).json(request.data);
    } catch (ex) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: ex });
    }
  }

  @Get('/trivia')
  async getGuildTrivia(
    @Req() request: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    let trivia = await getTrivia(query.guild_id);
    return response.status(200).json(trivia);
  }

  @Put('/trivia')
  async updateTrivia(
    @Req() request: Request,
    @Body() body: UpdateTriviaQuestionsDTO,
    @Res() response: Response,
  ) {
    const user = await getGuildOwner(request, body.guild_id);
    if (user === null) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Failed to get user." });
    }

    let trivia = await getTrivia(body.guild_id);
    let update = await prisma.guildTrivia.update({
      where: {
        guild_id: body.guild_id,
        id: trivia.id,
      },
      data: body.trivia,
    });
    return response.status(200).json(update);
  }

  @Get('/logging')
  async getGuildLogging(
    @Req() request: Request,
    @Query() query: GetGuildDTO,
    @Res() response: Response,
  ) {
    let logging = await getLogging(query.guild_id);
    return response.status(200).json(logging);
  }

  @Put('/logging')
  async updateGuildLogging(
    @Req() request: Request,
    @Body() body: GuildLogging,
    @Res() response: Response,
  ) {
    const user = await getGuildOwner(request, body.guild_id);
    if (user === null) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Failed to get user." });
    }

    let logging = await getLogging(body.guild_id);
    const update = await prisma.guildLogging.update({
      where: {
        guild_id: body.guild_id,
        id: body.id
      },
      data: body
    });
    
    return response.status(200).json(update);
  }

  @Post('/logging')
  async logEvent(
    @Req() request: Request,
    @Body() body,
    @Res() response: Response,
  ) {
    const token = request.headers.authorization;
    if (token === null) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Failed to get token.' });
    }

    const is_bot = token === process.env.BOT_AUTH_KEY;
    if (!is_bot) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid auth key.' });
    }

    const guild_logging = await getLogging(body.guild_id);
    // TODO: log event on web
  }
}
