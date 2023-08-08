import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { TrpcService } from '@server/trpc/trpc.service';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AwsCognitoService],
})
export class AuthModule {}
