import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, readFileSync } from 'fs';

async function bootstrap() {
  let http_options = {};
  if (existsSync("./key.pem") && existsSync("./cert.pem")) {
    http_options = {
      key: readFileSync("./key.pem"),
      cert: readFileSync("./cert.pem")
    };
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions: http_options
  });
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
