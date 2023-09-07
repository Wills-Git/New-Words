import { Controller, Get, Redirect, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DynamoDBService } from '@server/aws/dynamo-db/dynamo-db.service';
import { GoogleOAuthToken } from './auth.interface';
import { pipe, switchMap, from, catchError, of } from 'rxjs';
import * as jwt from 'jsonwebtoken';

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
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  private readonly awsCognitoClientId: string = process.env
    .AWS_COGNITO_CLIENT_ID as string;
  private readonly awsCognitoDomain: string = process.env
    .AWS_COGNITO_DOMAIN as string;
  @Get('/login')
  @Redirect()
  async redirectToCognitoHostedUI() {
    return {
      url: this.authService.CognitoRedirect(),
    };
  }

  @Get('/code')
  async authenticate(@Query('code') grantCode: string) {
    const response = await this.authService.getAccessToken(grantCode);
    const { id_token, access_token, refresh_token } = response.data;

    const decodedToken = jwt.decode(id_token) as GoogleOAuthToken;
    if (decodedToken && decodedToken.email) {
      // Extract the email field from the decoded token
      const email = decodedToken;

      console.log(decodedToken);
    }

    // console.log(idToken, 'idtoken');
    return from(
      this.dynamoDBService.storeTokens(id_token, access_token, refresh_token),
    ).pipe(
      switchMap(() => of({ message: 'Tokens stored successfully' })),
      catchError((error) => of({ error: 'Failed to store tokens' })),
    );
  }
}
