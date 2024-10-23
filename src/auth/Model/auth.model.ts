import * as mongoose from 'mongoose';


export const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique : true
      },
      password: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      salt : String

})

export interface userInterface{
    id : string
  
    email:string
    
    password:string
    
    name:string

    salt: string
}
