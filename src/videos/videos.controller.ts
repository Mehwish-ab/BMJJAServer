import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseFilters, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { VideosService } from './videos.service';
import { createVideoDto } from './DTO/createVideo.dto';
import { queryDto } from './DTO/query.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utlis/file-upload-utils';

@Controller('videos')
export class VideosController {
    constructor(
        private videoservice : VideosService
    ){}
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail'))
    async createVideos(@Body() videoData: createVideoDto , @UploadedFile() file: Express.Multer.File ){
        return await this.videoservice.createVideo(videoData,file)
    }
    @Patch('/:id')
    @UseInterceptors(FileInterceptor('thumbnail')) 
    async updateVideos(@Param('id') videoId,
    @Body() productToPost:createVideoDto, @UploadedFile() file: Express.Multer.File ){
        return await this.videoservice.updateVideo(videoId,productToPost,file)
    }
    @Delete('/:id')
    async deleteVideos(@Param('id') videoId){
        return await this.videoservice.deleteVideo(videoId)
    }
 
//     @Get()
//     async getVideos(@Query(ValidationPipe) queryParams: queryDto) {
//         return await this.videoservice.getVideos(queryParams);
//   }
  @Get()
  async getVideo() {
      return await this.videoservice.getAllVideos();
}
    @Post('/:id')
    async GetVideoById(@Param('id') id ){
        return await this.videoservice.getVideobyId(id)
    }
}
