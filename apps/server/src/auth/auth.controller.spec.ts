import { Test, TestingModule } from '@nestjs/testing';
import { CognitoAuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: CognitoAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CognitoAuthController],
    }).compile();

    controller = module.get<CognitoAuthController>(CognitoAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
