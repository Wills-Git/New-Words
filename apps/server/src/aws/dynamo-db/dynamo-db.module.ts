// dynamodb.module.ts
import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamo-db.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AWSModule } from '../aws.module';

@Module({
  providers: [DynamoDBClient, DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
