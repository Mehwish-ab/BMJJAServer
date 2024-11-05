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
  
    async createVideo(videoData: createVideoDto, File: Express.Multer.File) {
        // Check if the thumbnail file is present
        if (!File) {
          throw new Error("Thumbnail file is missing");
        }
      
        // Get the file extension and construct the image path with the extension
        const ext = path.extname(File.originalname); // Get the file extension (e.g., .png)
        const imagePath = `${File.filename}`; // Construct the filename with extension
      
     
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
        const { page , recordsPerPage ,category, subCategory } = queryParams;
    console.log("query ",queryParams)
        // Build search criteria object
        const searchCriteria: any = {};
    
     
    if (category && category !== "" ) {
      searchCriteria.category = category; // Filter by specific category
  }
  if (subCategory && subCategory !== "") {
      searchCriteria.subCategory = subCategory; // Filter by specific subcategory
  }
    
        // Get total results count based on search criteria
        const totalResult = await this.videosModel.find(searchCriteria).countDocuments();
        const total = await this.videosModel.find(searchCriteria)
    console.log("searchC",searchCriteria)
        // Fetch paginated results based on search criteria
        const result = await this.videosModel
            .find(searchCriteria)
            .sort({ date: -1 }) // Sort by date (or use createdAt if available)
            // .skip((+page - 1) * +recordsPerPage)
            .limit(+recordsPerPage);
    
        return {
            data: result,
            totalRecords: totalResult,
            total:total
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
        const video = await this.videosModel.deleteOne({_id:id});
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
