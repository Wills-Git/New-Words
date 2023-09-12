import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, firstValueFrom } from 'rxjs'; // Import Observable
import { AxiosResponse } from 'axios';
import { AuthService } from '../auth/auth.service'; // Your auth service that handles Google OAuth
import { HttpService } from '@nestjs/axios';
import { MediaItem } from './photo.interface';

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  @Get('latest')
  async getLatestPhoto(@Req() req: Request, @Res() res: Response) {
    try {
      const userID = req.cookies.userID;
      const sessionID = req.cookies.sessionID;
      // Get the user's access token from your authentication service
      const accessToken = await this.authService.getUserAccessToken(
        userID,
        sessionID,
      );

      const pageSize = 25;

      const apiUrl = `https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=${pageSize}`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(apiUrl, { headers }),
      );

      const mediaItems = response.data.mediaItems;
      if (mediaItems && mediaItems.length > 0) {
        // Handle the list of media items as needed
        // This array contains the media items from the user's library
        // You can access details of each media item in the mediaItems array
        // For example, mediaItems[0] represents the first media item

        // You can iterate through the mediaItems array to process each media item
        for (const mediaItem of mediaItems) {
          // Handle each media item
          // Example: Print the description of each media item
          console.log(mediaItem.description);
        }

        res.status(200).json({ mediaItems });
      } else {
        res.status(404).send("No photos found in the user's library.");
      }
    } catch (error) {
      // Handle errors here
      console.error('Error fetching or sending photo:', error);
      res.status(500).send('Error fetching or sending photo');
    }
  }
}
