// cookies.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CookiesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    try {
      cookieParser()(req, res, next);
    } catch (error) {
      console.error('Error in cookie parsing middleware:', error);
      next(); // Continue handling the error
    }
  }
}
