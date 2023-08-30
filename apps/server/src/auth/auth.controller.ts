import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';

// @Controller('api/v1/auth')
// export class AuthController {
//   constructor(private awsCognitoService: AwsCognitoService) {}

//   @Post('/register')
//   async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
//     console.log('hit register route');
//     return await this.awsCognitoService.registerUser(authRegisterUserDto);
//   }

//   @Post('/login')
//   @UsePipes(ValidationPipe)
//   async login(@Body() authLoginUserDto: AuthLoginUserDto) {
//     return await this.awsCognitoService.authenticateUser(authLoginUserDto);
//   }
// }

//redirect to AWS Cognito hosted UI
@Controller('/auth')
export class CognitoAuthController {
  private readonly awsCognitoClientId: string = process.env
    .AWS_COGNITO_CLIENT_ID as string;
  @Get('/login')
  @Redirect()
  async login() {
    const awsCognitoClientId = this.awsCognitoClientId;
    const responseType = 'code';
    const scope = 'email openid phone';
    const redirectUri = 'http://localhost:4000/auth/code/';

    const authUrl = `https://newwords.auth.us-east-2.amazoncognito.com/oauth2/authorize?response_type=${responseType}&client_id=${awsCognitoClientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}`;

    return {
      url: authUrl,
    };
  }

  @Get('/code')
  async sendCodeToGoogle() {
    //finish processing oauth
    return {};
  }
}
