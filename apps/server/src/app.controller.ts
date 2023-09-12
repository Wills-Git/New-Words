import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  checkLoggedIn(@Req() req: Request): string {
    const { sessionID, userID } = req.cookies;

    if (!sessionID || !userID) {
      // Handle the case where required cookies are missing
      // For example, you can redirect the user to the login page
      return 'Missing required cookies. Please log in.';
    }
    return sessionID;
  }
}
