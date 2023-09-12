// photo.module.ts
import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from '@server/auth/auth.module';
import { PhotosController } from './photo.controller';
import { PhotoService } from './photo.service';
import { AuthService } from '@server/auth/auth.service';
import { DynamoDBModule } from '@server/aws/dynamo-db/dynamo-db.module'; // Import DynamoDBModule

@Module({
  imports: [HttpModule, AuthModule, DynamoDBModule], // Use DynamoDBModule
  controllers: [PhotosController],
  providers: [PhotoService, AuthService],
})
export class PhotoModule {}
