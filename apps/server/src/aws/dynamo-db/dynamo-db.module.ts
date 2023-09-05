// dynamodb.module.ts
import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamo-db.service';
import { AWSModule } from '../aws.module';

@Module({
  imports: [AWSModule],
  providers: [DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
