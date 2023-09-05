import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DynamoDbService],
})
export class AppModule {}
