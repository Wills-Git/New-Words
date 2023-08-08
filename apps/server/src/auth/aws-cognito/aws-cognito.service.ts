import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDtoType, AuthUserDto } from '../auth-user.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    const userPoolID = process.env.AWS_COGNITO_USER_POOL_ID as string;
    const clientID = process.env.AWS_COGNITO_CLIENT_ID as string;

    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolID,
      ClientId: clientID,
    });
  }

  async registerUser(AuthUserDto: AuthLoginUserDtoType) {
    const { username, email, password } = AuthUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: username as string,
          }),
        ],
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

  async authenticateUser(authUserDTO: AuthLoginUserDtoType) {
    const { email, password } = authUserDTO;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

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
