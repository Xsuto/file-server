import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express } from 'express';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const { ID, originalName, createdAt, extension } =
      await this.appService.handleFileUpload(file);
    res.send({
      ID,
      originalName,
      createdAt,
      extension,
    });
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.appService.getFile(id);
    const stream = createReadStream(`./uploads/${file.ID}`);
    stream.pipe(res);
  }

  @Get('yt/:url')
  async getYoutubeFilm(@Param('url') url: string, @Res() res) {
    const decodedUrl = decodeURIComponent(url);
    const { ID, originalName, createdAt, extension } =
      await this.appService.getYoutubeFilm(decodedUrl);
    res.send({
      ID,
      originalName,
      createdAt,
      extension,
    });
  }

  @Get('files')
  async getAllFiles() {
    const files = await this.appService.getAllFiles();
    return files.map(({ ID, originalName, createdAt, extension }) => {
      return {
        ID,
        originalName,
        createdAt,
        extension,
      };
    });
  }
}
