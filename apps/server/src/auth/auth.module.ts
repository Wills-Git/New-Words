import { Module} from '@nestjs/common';
import { CognitoAuthController } from './auth.controller'
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  controllers: [CognitoAuthController],
  providers: [AwsCognitoService, AuthService],
  
})
export class AuthModule {}
