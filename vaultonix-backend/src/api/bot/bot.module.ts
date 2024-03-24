import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BotController } from "./bot.controller";
import { BotMiddleware } from "./bot.middleware";

@Module({
    controllers: [BotController]
})
export class BotModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(BotMiddleware)
            .forRoutes("/api/v1/bot")
    }
} 