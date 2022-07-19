import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './schemas/file.schema';
console.log(process.env);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://database:27017/files'),
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
