import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { DynamoDBService } from './aws/dynamo-db/dynamo-db.service';
import { DynamoDBModule } from './aws/dynamo-db/dynamo-db.module';
import { AWSModule } from './aws/aws.module';
import awsConfig from '../aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    AuthModule,
    DynamoDBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
