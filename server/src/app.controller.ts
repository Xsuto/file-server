import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express } from 'express';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileInterface } from './schemas/file.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileInterface> {
    const { ID, originalName, extension, createdAt } =
      await this.appService.handleFileUpload(file);
    return { ID, originalName, extension, createdAt };
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string): Promise<StreamableFile> {
    const file = await this.appService.getFile(id);
    const stream = createReadStream(`./uploads/${file.ID}`);
    return new StreamableFile(stream);
  }

  @Get('yt/:url')
  async getYoutubeFilm(@Param('url') url: string): Promise<FileInterface> {
    const decodedUrl = decodeURIComponent(url);
    try {
      const { ID, originalName, extension, createdAt } =
        await this.appService.getYoutubeFilm(decodedUrl);
      return { ID, originalName, extension, createdAt };
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      throw new HttpException(
        "Internal error couldn't download film",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('files')
  async getAllFiles(): Promise<FileInterface[]> {
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
