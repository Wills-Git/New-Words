import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true });
  app.use(cookieParser());

  await app.listen(process.env.PORT || 4000);

  console.log('listening on port', 4000);
}
bootstrap();
