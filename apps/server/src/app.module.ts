import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { ConfigModule } from '@nestjs/config';
import { TrpcService } from './trpc/trpc.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    TrpcModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, TrpcService, AuthService],
})
export class AppModule {}
