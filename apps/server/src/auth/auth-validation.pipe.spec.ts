import { ZodValidationPipe } from './auth-validation.pipe';
import { AuthUserDto } from './auth-user.dto';

describe('AuthPipe', () => {
  it('should be defined', () => {
    const validationPipe = new ZodValidationPipe(AuthUserDto);
    expect(validationPipe).toBeDefined();
  });
});
