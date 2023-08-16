import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from '../dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from '../dtos/auth-register-user.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterUserDto) {
    const { name, email, password } = authRegisterUserDto;
    console.log('should be name', name);
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'preferred_username',
          Value: name,
        }),
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      ];

      this.userPool.signUp(
        email,
        password,
        attributeList,
        [],
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;

    const authenticationDetails = new AuthenticationDetails({
      Username: email, // Use the email address here
      Password: password,
    });

    const userData = {
      Username: email, // Also use the email address here
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
