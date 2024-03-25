import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APIModule } from './api/api.module';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './api/user/user.module';
import { BotModule } from './api/bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { GuildModule } from './api/guild/guild.module';
import { DiscordModule } from './api/discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15
    }]),
    // Modules
    APIModule,
    UserModule,
    BotModule,
    GuildModule,
    DiscordModule,
    RouterModule.register([
      {
        // /api/v1
        path: "api/v1",
        module: APIModule,
        children: [
          {
            // /api/v1/user
            path: "user",
            module: UserModule
          },
          {
            // /api/v1/bot
            path: "bot",
            module: BotModule
          },
          {
            // /api/v1/guild
            path: "guild",
            module: GuildModule
          },
          {
            // /api/v1/discord
            path: "discord",
            module: DiscordModule
          }
        ]
      }
    ])
  ],
})
export class AppModule {}
