import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import * as ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('File') private readonly filesDatabase: Model<FileDocument>,
  ) {}

  async saveFile(
    ID: string,
    originalName: string,
    extension?: string,
  ): Promise<File> {
    const newFile = new this.filesDatabase({
      ID,
      originalName,
      extension,
    });
    return newFile.save();
  }

  async handleFileUpload(file: Express.Multer.File): Promise<File> {
    return this.saveFile(file.filename, file.originalname);
  }

  async getFile(id: string): Promise<File> {
    return this.filesDatabase.findOne({
      ID: id,
    });
  }

  async getAllFiles(): Promise<File[]> {
    return this.filesDatabase.find().exec();
  }

  async getYoutubeFilm(url: string): Promise<File> {
    console.log('url ', url);
    const info = await ytdl.getInfo(url);
    const name = info.videoDetails.title;
    const id = v4().replace(/-/g, '');
    console.log(name, id);

    const video = await ytdl(url);
    const videoStream = createWriteStream(`./uploads/${id}`);
    const stream = video.pipe(videoStream);
    const promise = new Promise((resolve) => {
      stream.on('finish', () => resolve(0));
    });
    await promise;
    return this.saveFile(id, name, '.mp4');
  }
}
