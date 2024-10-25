
import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { videoSchema } from './Model/video.model';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
@Module({
  imports: [ MongooseModule.forFeature([
    {name : "videos" , schema :videoSchema}
  ]),
  MulterModule.register({
    storage: diskStorage({
        destination: './thumbnails', // Directory for storing files
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname); // Get file extension
          const uniqueName = `${uuidv4()}${ext}`; // Generate unique filename
          cb(null, uniqueName); // Use unique filename
        },
      }),
  }) 
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
