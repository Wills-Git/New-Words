import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  GoogleOAuthToken,
  UserSession,
  RefreshReponse,
} from './auth.interface';
import * as jwt from 'jsonwebtoken';

import { DynamoDBService } from '@server/aws/dynamo-db/dynamo-db.service';
import { access } from 'fs';
import { Error } from 'aws-sdk/clients/ses';

@Injectable()
export class AuthService {
  private readonly userSessions: Map<string, string> = new Map();
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

  async handleOAuthResponse(grantCode: string, res: Response): Promise<void> {
    try {
      const response = await this.getAccessToken(grantCode);

      const { id_token, access_token, refresh_token } = response.data;
      const { sub: userID } = jwt.decode(id_token) as GoogleOAuthToken;
      const sessionID = this.generateSessionID();
      //set cookies

      res.cookie('userID', userID, { domain: 'localhost' });
      res.cookie('sessionID', sessionID, { domain: 'localhost' });

      // Store tokens in DynamoDB
      await this.dynamoDBService.storeTokens(
        userID,
        sessionID,
        access_token,
        refresh_token,
      );

      return; // Completes the observable successfully
    } catch (error) {
      // Handle errors if needed
      this.logger.error(error); // Propagate the error
    }
  }

  generateSessionID(): string {
    const uuid = uuidv4();
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert to 1-based index
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    const formattedDateTime = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute}:${currentSecond}`;
    const sessionID: string = `${uuid} | ${formattedDateTime}`;
    return sessionID;
  }

  async getUserAccessToken(
    userID: string,
    sessionID: string,
  ): Promise<string | null> {
    try {
      // Retrieve tokens from DynamoDB based on userID and sessionID
      const result = await lastValueFrom(
        this.dynamoDBService.getTokens(sessionID, userID).pipe(
          map((tokens: UserSession) => {
            if (tokens) {
              const accessToken = tokens.accessToken;
              this.logger.log(accessToken);
              return accessToken;
            } else {
              this.logger.log('no token');
              return null;
            }
          }),
          catchError((error: Error) => {
            this.logger.error(error);
            // Handle errors that occur during the observable chain
            // This includes cases when tokens are not found or other errors
            return of(null); // Return a null value in case of error
          }),
        ),
      );
      return result as string | null;
    } catch (error) {
      // Handle any errors thrown during the observable execution
      this.logger.error(error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = jwt.decode(token) as { exp?: number };
    if (!decodedToken || !decodedToken.exp) {
      return true; // If the token is invalid or doesn't have an expiration time, consider it expired
    }
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  }
  async refreshAccessToken(
    refreshToken: string,
    sessionID: string,
  ): Promise<AxiosResponse<any>> {
    //check if refreshtoken is expired
    if (this.isTokenExpired(refreshToken)) {
      this.CognitoRedirect();
    }
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
      client_id: this.awsCognitoClientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
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
    const { access_token: newAccessToken } = response.data;
    this.dynamoDBService.updateAccessToken(sessionID, newAccessToken);
    return newAccessToken;
  }
}
