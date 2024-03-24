import { Module } from "@nestjs/common";
import { GuildController } from "./guild.controller";

@Module({
    controllers: [GuildController]
})
export class GuildModule {}