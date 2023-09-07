import { Module } from '@nestjs/common';
import { CognitoAuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { DynamoDBService } from '@server/aws/dynamo-db/dynamo-db.service';
import { DynamoDBModule } from '@server/aws/dynamo-db/dynamo-db.module';
import { AWSModule } from '@server/aws/aws.module';

@Module({
  imports: [HttpModule, DynamoDBModule],
  controllers: [CognitoAuthController],
  providers: [AwsCognitoService, AuthService],
})
export class AuthModule {}
