import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CognitoAuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { DynamoDBModule } from '@server/aws/dynamo-db/dynamo-db.module';
import { CookiesMiddleware } from './cookies/cookies.middleware';

@Module({
  imports: [HttpModule, DynamoDBModule],
  controllers: [CognitoAuthController],
  providers: [AwsCognitoService, AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookiesMiddleware).forRoutes('*');
  }
}
