import * as mongoose from 'mongoose';


export const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique : true
      },
      smallDescription: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
     
      subCategory:{
        type: String,
        required: true
      },
      embedLink:{
        type: String,
        required: true
      },
      thumbnail:{
        type: String,
      },
      description:{
        type: String,
      } ,
       date: { type: Date, required: true, default: Date.now },

})

export interface videoInterface{
  title: string,
  smallDescription: string,
  category: string,
  subCategory: string,
  embedLink: string,
  thumbnail: File,
  description:string
  date: Date
}
