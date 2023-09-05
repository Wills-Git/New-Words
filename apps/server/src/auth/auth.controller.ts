import {
  Controller,
  Get,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Session } from 'ex'
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
  constructor(
    private readonly authService: AuthService,
) {}

  private readonly awsCognitoClientId: string = process.env
    .AWS_COGNITO_CLIENT_ID as string;
    private readonly awsCognitoDomain: string = process.env.AWS_COGNITO_DOMAIN as string;
  @Get('/login')
  @Redirect()
  async login() {
    const awsCognitoDomain = this.awsCognitoDomain;
    const awsCognitoClientId = this.awsCognitoClientId;
    const responseType = 'code';
    const scope = 'email openid phone';
    const redirectUri = 'http://localhost:4000/auth/code/';

    const authUrl = `${awsCognitoDomain}/oauth2/authorize?response_type=${responseType}&client_id=${awsCognitoClientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}`;

    return {
      url: authUrl,
    };
  }

  @Get('/code')
  async authenticate(@Query('code') grantCode: string) {
  
      const response = await this.authService.getAccessToken(grantCode)
      console.log(response)
    
    return {};
  }
}
