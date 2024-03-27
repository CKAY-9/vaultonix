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
import { Response, Request, response } from 'express';
import { prisma } from '../prisma';
import { initializeStoreData } from './store.utils';
import { GetStoreItemDTO, NewStoreItemDTO } from './store.dto';

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
      const item = await prisma.itemStoreEntry.findFirst({
        where: {
          id: Number.parseInt(query.item_id.toString())
        }
      });
      if (item === null) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Failed to get item.' });
      }
      return response
        .status(200)
        .json(item);
    } catch (ex) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Failed to get item.' });
    }
  }
}
