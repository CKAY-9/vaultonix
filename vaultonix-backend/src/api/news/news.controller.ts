import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request, response } from 'express';
import { GetNewsArticleDTO, NewNewsArticleDTO } from './news.dto';
import { prisma } from '../prisma';
import { getUserFromToken, getUserStaffPerms } from '../user/user.utils';

@Controller('')
export class NewsController {
  @Post('')
  async newNewsArticle(
    @Req() request: Request,
    @Body() body: NewNewsArticleDTO,
    @Res() response: Response,
  ) {
    const token = request.headers.authorization;
    if (token === null) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: "Failed to get token."});
    }

    const user = await getUserFromToken(token);
    if (user === null) {
      return response.status(HttpStatus.NOT_FOUND).json({message: "Failed to get user."});
    }

    const staff = await getUserStaffPerms(user.id);
    // TODO: check specific staff perms
    if (staff === null) {
      return response.status(HttpStatus.UNAUTHORIZED).json({message: "Invalid staff permissions"});
    }

    const insert = await prisma.newsArticle.create({
      data: {
        title: body.title,
        body: body.body,
        author_id: Number.parseInt(body.author_id.toString()),
      },
    });
    return response.status(200).json(insert);
  }

  @Get('')
  async getNewsArticle(
    @Req() request: Request,
    @Query() query: GetNewsArticleDTO,
    @Res() response: Response,
  ) {
    const article = await prisma.newsArticle.findFirst({
      where: {
        id: Number.parseInt(query.article_id.toString()),
      },
    });
    if (article === null) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to get news article.' });
    }
    return response.status(200).json(article);
  }

  @Get('/all')
  async getAllNewsArticles(@Req() request: Request, @Res() response: Response) {
    const articles = await prisma.newsArticle.findMany({});
    return response.status(200).json(articles);
  }
}
