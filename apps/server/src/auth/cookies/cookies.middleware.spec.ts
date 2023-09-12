import { CookiesMiddleware } from './cookies.middleware';

describe('CookiesMiddleware', () => {
  it('should be defined', () => {
    expect(new CookiesMiddleware()).toBeDefined();
  });
});
