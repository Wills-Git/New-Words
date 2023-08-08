import { Controller, Post, Body } from '@nestjs/common';
import { AuthUserDto, AuthLoginUserDtoType } from './auth-user.dto';
import { ZodValidationPipe } from './auth-validation.pipe';
import { AwsCognitoService } from './aws-cognito/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  async register(@Body() authUserDto: AuthLoginUserDtoType) {
    return await this.awsCognitoService.registerUser(authUserDto);
  }

  @Post('/login')
  async login(
    @Body(new ZodValidationPipe(AuthUserDto))
    loginUserDto: AuthLoginUserDtoType,
  ) {
    // The loginUserDto will be automatically validated
    console.log('Valid data:', loginUserDto);
    // Your logic to handle the validated data goes here
  }
}
