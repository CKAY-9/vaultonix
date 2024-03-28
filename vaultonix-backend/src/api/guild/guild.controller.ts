import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request, response, query } from 'express';
import { prisma } from '../prisma';
import {
  GuildIDDTO,
  UpdateAutoRolesDTO,
  UpdateLevelRewardsDTO,
  UpdateWelcomeGoodbyeDTO,
} from './guild.dto';
import { GetGuildDTO } from '../bot/bot.dto';
import {
  getGuildTriviaWithID,
  getLevelRewards,
  initializeLevelRewards,
  initializeServerData,
  initializeTrivia,
  initializeWelcomeGoodbye,
} from './guild.utils';
import axios from 'axios';
import { DISCORD_API } from 'src/resources';

@Controller('')
export class GuildController {
  @Get('')
  async getGuildFromID(
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
      const config = await prisma.guildSettings.findFirst({
        where: {
          guild_id: query.guild_id,
        },
      });
      if (config === null) {
        await initializeServerData(query.guild_id);
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
    let config = await prisma.guildSettings.findFirst({
      where: {
        guild_id: query.guild_id,
      },
    });
    if (config === null) {
      const re = await initializeServerData(query.guild_id);
      config = re.config;
    }
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
    let guild = await prisma.guildSettings.findFirst({
      where: {
        guild_id: body.guild_id,
      },
    });
    if (guild === null) {
      await initializeServerData(body.guild_id);
      guild = await prisma.guildSettings.findFirst({
        where: {
          guild_id: body.guild_id,
        },
      });
    }

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
    let guild_welcome_goodbye = await prisma.guildWelcomeGoodbye.findFirst({
      where: {
        guild_id: query.guild_id,
      },
    });
    if (guild_welcome_goodbye === null) {
      guild_welcome_goodbye = await initializeWelcomeGoodbye(query.guild_id);
    }

    return response.status(200).json(guild_welcome_goodbye);
  }

  @Put('/welcome_goodbye')
  async updateWelcomeGoodbyeMessage(
    @Req() request: Request,
    @Body() body: UpdateWelcomeGoodbyeDTO,
    @Res() response: Response,
  ) {
    let guild_welcome_goodbye = await prisma.guildWelcomeGoodbye.findFirst({
      where: {
        guild_id: body.guild_id,
      },
    });
    if (guild_welcome_goodbye === null) {
      guild_welcome_goodbye = await initializeWelcomeGoodbye(body.guild_id);
    }

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
      let levels = await prisma.guildLevelRewards.findFirst({
        where: {
          guild_id: body.guild_id,
        },
      });
      if (levels === null) {
        levels = await initializeLevelRewards(body.guild_id);
      }

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
        method: "GET",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
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
    let trivia = await getGuildTriviaWithID(query.guild_id);
    if (trivia === null) {
      trivia = await initializeTrivia(query.guild_id);
    }
    return response.status(200).json(trivia);
  }
}
