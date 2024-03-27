import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class APIController {
  @Get('/')
  statusResponse(@Res() response: Response) {
    return response.status(200).json({ status: 'online' });
  }
}
