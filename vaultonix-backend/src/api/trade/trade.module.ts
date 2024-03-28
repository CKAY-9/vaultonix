import { Module } from "@nestjs/common";
import { TradeController } from "./trade.controller";

@Module({
  controllers: [TradeController]
})
export class TradeModule {}