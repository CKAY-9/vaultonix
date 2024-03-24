import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";

@Injectable()
export class BotMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const auth_header = req.headers.authorization;
        if (auth_header === undefined || auth_header !== process.env.BOT_AUTH_KEY) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Invalid BOT_AUTH_KEY!"});
        }
        next();
    }
}