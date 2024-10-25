import { Injectable } from '@nestjs/common';
import { videoInterface } from './Model/video.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createVideoDto } from './DTO/createVideo.dto';
import { queryDto } from './DTO/query.dto';
const path = require('path');

@Injectable()
export class VideosService {
    constructor(
        @InjectModel("videos")
        private videosModel : Model<videoInterface> ,
    ){}
    // async createVideo(videoData : createVideoDto, File: Express.Multer.File, ){
      
    //     if (!File) {
    //         throw new Error("Thumbnail file is missing");
    //     }
    
    //     // Construct the image path correctly
    //    const ext = path.extname(File.originalname)
    //    const imagePath = `${File.filename}${ext}`; // Use the correct file path directly
   
    //    console.log("file name",imagePath,File)
    //     const embedLink = videoData.embedLink;
    //     const videoIdMatch = embedLink.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);
    
    //     if (!videoIdMatch) {
    //         throw new Error("Invalid YouTube link format");
    //     }
    
    //     const videoId = videoIdMatch[1];
    //     const embedFormatLink = `https://www.youtube.com/embed/${videoId}`; // Transform to embed link format
    //     try{
            
    //         const newVideo = await this.videosModel.create({
    //             ...videoData,
    //             embedLink: embedFormatLink, 
    //             thumbnail:imagePath,
    //             date:new Date
    //         })

    //      await newVideo.save()
    //         return {
    //             message : "VideoCreated" ,
    //             newVideo
    //            }
    //     }catch(error){
    //         return error
    //     }

    // }
    async createVideo(videoData: createVideoDto, File: Express.Multer.File) {
        // Check if the thumbnail file is present
        if (!File) {
          throw new Error("Thumbnail file is missing");
        }
      
        // Get the file extension and construct the image path with the extension
        const ext = path.extname(File.originalname); // Get the file extension (e.g., .png)
        const imagePath = `${File.filename}`; // Construct the filename with extension
      
        console.log("Thumbnail filename with extension:", imagePath, File);
      
        // Validate and format the YouTube embed link
        const embedLink = videoData.embedLink;
        const videoIdMatch = embedLink.match(
          /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/
        );
      
        if (!videoIdMatch) {
          throw new Error("Invalid YouTube link format");
        }
      
        // Extract the video ID and transform it into an embeddable link
        const videoId = videoIdMatch[1];
        const embedFormatLink = `https://www.youtube.com/embed/${videoId}`; 
      
        try {
          // Create and save the new video in the database
          const newVideo = await this.videosModel.create({
            ...videoData,
            embedLink: embedFormatLink, // Use the formatted embed link
            thumbnail: imagePath, // Save the thumbnail filename with extension
            date: new Date(), // Save the current date
          });
      
          // Save the new video record
          await newVideo.save();
      
          return {
            message: "VideoCreated",
            newVideo, // Return the created video data
          };
        } catch (error) {
          return error; // Return any error encountered during the process
        }
      }
      
    async getVideos(queryParams: queryDto) {
        const { page = 1, recordsPerPage = 15, search } = queryParams;
        const totalResult = await this.videosModel.find().countDocuments();
        const result = await this.videosModel
          .find({
            $or: [{ name: { $regex: `^${search}`, $options: 'i' } }],
          })
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +recordsPerPage)
          .limit(+recordsPerPage);
    
        return {
          data: result,
          totalRecords: result.length,
        };
      }
    
      async getAllVideos() {
        const video =await this.videosModel.find()
        
        return video;
      }
      async getVideobyId(id) {
        const video = await this.videosModel.findById(id).exec();
        return video;
      }
    
      async deleteVideo(id) {
        const video = await this.videosModel.deleteOne(id);
        return video;
      }
      async updateVideo(
        videoId: string,
        videoData: Partial<createVideoDto>, // Partial allows updating some fields
        file?: Express.Multer.File, // Optional, in case no new file is provided
      ): Promise<any> {
        try {
          // Find the existing video by ID
          const existingVideo = await this.videosModel.findById(videoId);
          
          if (!existingVideo) {
            return { message: 'Video not found' };
          }
      
          // If a new file is provided, generate the new thumbnail path
         let thumbnailPath: string | File = existingVideo.thumbnail; // Keep the existing thumbnail by default
          if (file) {
            thumbnailPath = [file.path, file.originalname.split('.').pop()].join('.');
          }
      
          // Update the video with the new data and/or thumbnail
          const updatedVideo = await this.videosModel.findByIdAndUpdate(
            videoId,
            {
              ...videoData, // Spread updated video data
              thumbnail: thumbnailPath, // Either new thumbnail or the existing one
            },
            { new: true }, // Return the updated document
          );
      
          return {
            message: 'Video updated successfully',
            updatedVideo,
          };
        } catch (error) {
          return {
            message: 'Error updating video',
            error,
          };
        }
      }
    
      

}
