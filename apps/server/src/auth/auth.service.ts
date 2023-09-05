import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(AuthService.name);
  private readonly awsCognitoDomain: string = process.env.AWS_COGNITO_DOMAIN as string;
  private readonly awsCognitoClientId: string = process.env.AWS_COGNITO_CLIENT_ID as string;
  private readonly awsCognitoClientSecret: string = process.env.AWS_COGNITO_CLIENT_SECRET as string; // Add this line

  async getAccessToken(grantCode: string): Promise<AxiosResponse<any>> {
    const url: string = `${this.awsCognitoDomain}/oauth2/token`;
    
    // Encode the client_id and client_secret in "client_secret_basic" format
    const authHeader = `Basic ${Buffer.from(`${this.awsCognitoClientId}:${this.awsCognitoClientSecret}`).toString('base64')}`;
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader, // Include the Authorization header
    };
    const data = {
      code: grantCode,
      redirect_uri: 'http://localhost:4000/auth/code/',
      grant_type: 'authorization_code',
    };

    const response = await lastValueFrom(
      this.httpService.post(url, new URLSearchParams({ ...data }), {
        headers,
      }).pipe(
        catchError((error: AxiosError) => {
          if (error.response) {
            this.logger.error(error.response.data);
          } else {
            this.logger.error('Request failed:', error.message);
          }
          throw error;
        })
      )
    );

    return response;
  }
}
