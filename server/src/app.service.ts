import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('File') private readonly filesDatabase: Model<FileDocument>,
  ) {}

  async handleFileUpload(file: Express.Multer.File): Promise<File> {
    const newFile = new this.filesDatabase({
      ID: file.filename,
      originalName: file.originalname,
    });
    return newFile.save();
  }

  async getFile(id: string): Promise<File> {
    return this.filesDatabase.findOne({
      ID: id,
    });
  }

  async getAllFiles(): Promise<File[]> {
    return this.filesDatabase.find().exec();
  }
}
