import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VideosModule } from './videos/videos.module';
import { CategoryModule } from './Category/category.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Import path for directory joining
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.mongoUri),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'thumbnails'), // Path to the thumbnails directory
      serveRoot: '/thumbnails',  // The URL prefix you want to use for accessing files
    }),
    AuthModule,
    VideosModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



