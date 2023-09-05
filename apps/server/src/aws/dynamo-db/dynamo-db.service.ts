// dynamodb.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Observable, from, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  private readonly credentials = {};
  constructor(
    private readonly dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    }),
  ) {}

  async storeTokens(
    sessionId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    const params: PutItemCommandInput = {
      TableName: 'newwords-user-tokens',
      Item: {
        SessionId: { S: sessionId },
        AccessToken: { S: accessToken },
        RefreshToken: { S: refreshToken },
      },
    };

    const command = new PutItemCommand(params);

    return from(this.dynamoDBClient.send(command)).pipe(
      tap(() => this.logger.log('tokens stored successfully')),
      catchError((error) => {
        this.logger.log('Error storing tokens', error);
        return throwError(() => error);
      }),
      map(() => undefined),
    );
  }

  getTokens(sessionId: string): Observable<any> {
    // Define the input parameters for the GetItemCommand
    const params: GetItemCommandInput = {
      TableName: 'newwords-user-tokens',
      Key: {
        SessionId: { S: sessionId },
      },
    };

    const command = new GetItemCommand(params);

    return from(this.dynamoDBClient.send(command)).pipe(
      map((response) => {
        const tokens = response.Item;
        return tokens;
      }),
      catchError((error) => {
        this.logger.error('Error retrieving tokens:', error);
        return throwError(() => error);
      }),
    );
  }

  updateAccessToken(
    sessionId: string,
    newAccessToken: string,
  ): Observable<void> {
    // Define the input parameters for the UpdateItemCommand
    const params: UpdateItemCommandInput = {
      TableName: 'newwords-user-tokens',
      Key: {
        SessionId: { S: sessionId },
      },
      UpdateExpression: 'SET AccessToken = :accessToken',
      ExpressionAttributeValues: {
        ':accessToken': { S: newAccessToken },
      },
    };

    const command = new UpdateItemCommand(params);

    return from(this.dynamoDBClient.send(command)).pipe(
      tap(() => this.logger.log('Access token updated successfully')),
      catchError((error) => {
        this.logger.error('Error updating access token:', error);
        return throwError(() => error);
      }),
      map(() => undefined), // Map the result to void (optional)
    );
  }
}
