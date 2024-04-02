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
import { Response, Request, response, query } from 'express';
import { prisma } from '../prisma';
import { getStoreItemFromID, initializeStoreData } from './store.utils';
import { BuyItemDTO, GetStoreItemDTO, NewStoreItemDTO } from './store.dto';
import { addXPToUser, getGuildUserFromID, getUserFromToken } from '../user/user.utils';

@Controller('')
export class StoreController {
  @Get('')
  async getStoreData(@Req() request: Request, @Res() response: Response) {
    let store_data = await prisma.itemStore.findFirst({
      where: {
        id: 1,
      },
    });
    if (store_data === null) {
      store_data = await initializeStoreData();
    }
    return response.status(200).json(store_data);
  }

  @Put('')
  async updateStoreData(
    @Req() request: Request,
    @Body() body: any,
    @Res() response: Response,
  ) {}

  @Post('/items')
  async createNewStoreItem(
    @Req() request: Request,
    @Body() body: NewStoreItemDTO,
    @Res() response: Response,
  ) {
    const insert = await prisma.itemStoreEntry.create({
      data: {
        credit_price: Number.parseInt(body.credit_price.toString()),
        description: body.description,
        item_id: body.item_id,
        money_price: Number.parseInt(body.money_price.toString()),
        name: body.name,
        premium: body.premium,
        sale: Number.parseInt(body.sale.toString()),
        stock: Number.parseInt(body.stock.toString()),
        thumbnail: body.thumbnail,
      },
    });
    const updated_inventory = await prisma.itemStoreEntry.findMany({});
    return response.status(200).json(updated_inventory);
  }

  @Get('/items')
  async getStoreItems(@Req() request: Request, @Res() response: Response) {
    let store_items = await prisma.itemStoreEntry.findMany({});
    return response.status(200).json(store_items);
  }

  @Get('/item')
  async getStoreItem(
    @Req() request: Request,
    @Query() query: GetStoreItemDTO,
    @Res() response: Response,
  ) {
    try {
      const item = await getStoreItemFromID(query.item_id);
      if (item === null) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Failed to get item.' });
      }
      return response.status(200).json(item);
    } catch (ex) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to get item.' });
    }
  }

  @Post('/webhook')
  async stripeWebhook(
    @Req() request: Request,
    @Body() body: any,
    @Res() response: Response,
  ) {
    const event = body;

    switch (event.type) {
      case 'payment_intent.succeeded':
        const payment_intent = event.data.object;
        break;
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return response.status(200).json({ received: true });
  }

  @Post("/purchase")
  async purchaseItem(@Req() request: Request, @Body() body: BuyItemDTO, @Res() response: Response) {
    const token = request.headers.authorization;
    if (token === null) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: "Failed to get token."});
    }

    const user = await getUserFromToken(token);
    if (user === null) {
      return response.status(HttpStatus.NOT_FOUND).json({message: "Failed to get user."});
    }

    const guild_user = await getGuildUserFromID(body.guild_id, user.id.toString());
    if (guild_user === null) {
      return response.status(HttpStatus.NOT_FOUND).json({message: "Failed to get guild user."});
    }

    if (guild_user.user_id !== user.discord_id) {
      return response.status(HttpStatus.UNAUTHORIZED).json({message: "Guild and Vaultonix user data didn't match!"});
    }

    const item = await getStoreItemFromID(body.item_id); 
    if (item === null) {
      return response.status(HttpStatus.NOT_FOUND).json({message: "Failed to get item."});
    }

    if (item.premium && !user.supporter) {
      return response.status(HttpStatus.UNAUTHORIZED).json({message: "Premium only item."});
    }

    if (body.credits) {
      if (item.credit_price > guild_user.credits) {
        return response.status(HttpStatus.BAD_REQUEST).json({message: "User doesn't have enough credits."});
      }

      const inv: string[] = JSON.parse(guild_user.inventory);
      inv.push(item.id.toString());

      const xp_add = await addXPToUser(guild_user, Math.floor(item.credit_price / 10));

      const update = await prisma.guildUsers.update({
        where: {
          id: guild_user.id,
          guild_id: guild_user.guild_id,
          user_id: body.user_id
        },
        data: {
          credits: guild_user.credits - item.credit_price,
          inventory: JSON.stringify(inv)
        }
      });

      return response.status(200).json({message: "Bought item with credits."});
    }
  }
}
