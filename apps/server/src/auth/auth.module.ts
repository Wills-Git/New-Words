import { Module } from '@nestjs/common';
import { CognitoAuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';

@Module({
  imports: [],
  controllers: [CognitoAuthController],
  providers: [AwsCognitoService],
})
export class AuthModule {}
