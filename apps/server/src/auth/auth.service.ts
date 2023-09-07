import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';

import { DynamoDBService } from '@server/aws/dynamo-db/dynamo-db.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  private readonly logger = new Logger(AuthService.name);
  private readonly awsCognitoDomain: string = process.env
    .AWS_COGNITO_DOMAIN as string;
  private readonly awsCognitoClientId: string = process.env
    .AWS_COGNITO_CLIENT_ID as string;
  private readonly awsCognitoClientSecret: string = process.env
    .AWS_COGNITO_CLIENT_SECRET as string; // Add this line

  CognitoRedirect(): string {
    const awsCognitoDomain = this.awsCognitoDomain;
    const awsCognitoClientId = this.awsCognitoClientId;
    const responseType = 'code';
    const scope = 'email openid phone';
    const redirectUri = 'http://localhost:4000/auth/code/';

    const authUrl = `${awsCognitoDomain}/oauth2/authorize?response_type=${responseType}&client_id=${awsCognitoClientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}`;
    return authUrl;
  }

  async getAccessToken(grantCode: string): Promise<AxiosResponse<any>> {
    const url: string = `${this.awsCognitoDomain}/oauth2/token`;

    // Encode the client_id and client_secret in "client_secret_basic" format
    const authHeader = `Basic ${Buffer.from(
      `${this.awsCognitoClientId}:${this.awsCognitoClientSecret}`,
    ).toString('base64')}`;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader, // Include the Authorization header
    };
    const data = {
      code: grantCode,
      redirect_uri: 'http://localhost:4000/auth/code/',
      grant_type: 'authorization_code',
    };

    const response = await lastValueFrom(
      this.httpService
        .post(url, new URLSearchParams({ ...data }), {
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              this.logger.error(error.response.data);
            } else {
              this.logger.error('Request failed:', error.message);
            }
            throw error;
          }),
        ),
    );

    return response;
  }

  async storeOAuthData(
    sessionId: string, // You may need to adjust the parameters based on the data you receive from Google OAuth
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.dynamoDBService.storeTokens(
      sessionId,
      accessToken,
      refreshToken,
    );
  }
}
