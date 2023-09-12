import { Controller, Get, Redirect, Query, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DynamoDBService } from '@server/aws/dynamo-db/dynamo-db.service';
import { Response } from 'express';
import { pipe, switchMap, from, catchError, of, throwError } from 'rxjs';

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
  private readonly logger = new Logger(CognitoAuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Redirect()
  async redirectToCognitoHostedUI() {
    return {
      url: this.authService.CognitoRedirect(),
    };
  }

  @Get('/code')
  @Redirect()
  async authenticate(@Query('code') grantCode: string, @Res() res: Response) {
    // console.log(idToken, 'idtoken');
    try {
      await this.authService.handleOAuthResponse(grantCode, res);
      this.logger.log('tokens stored');
      return { url: 'http://localhost:4000' };
    } catch (error) {
      this.logger.error('Failed to store tokens:', error);
      throw error; // Re-throw the error to propagate it
    }
  }
}
