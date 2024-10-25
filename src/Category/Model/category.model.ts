import * as mongoose from 'mongoose';


export const categorySchema = new mongoose.Schema({
      type: {
        type: String,
        required: true
      },
  subType:{
    type: String,
    required: true
  }

})

export interface categoryInterface{
 type:string,
 subtype:string
}
