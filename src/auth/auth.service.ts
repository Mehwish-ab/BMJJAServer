import { Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userInterface } from './Model/auth.model';
import { authSignupDto } from './DTO/authSignup.dto';
import * as bcrypt from 'bcrypt'
import { authLoginDto } from './DTO/authLogin.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel("admin")
        private adminModel : Model<userInterface> ,
        private jwtService : JwtService
    
    ){}

    async userLogin(loginCredentials : authLoginDto ){
      
        const {email , password} = loginCredentials
        const user = await this.adminModel.findOne({
            email : email
        })
     
        if(!user){
            throw new  UnauthorizedException("Invalid Email")
           
        }
        const payload = {
            user: {
                id : user._id.toString() ,
                email : user.email,
                name: user.name
            }
        }

        const newPasswordHash = await this.generateHash(password ,user.salt)


        if(newPasswordHash != user.password)
        {   
            throw new  UnauthorizedException("Invalid password")
        }

        const token = this.jwtService.sign(payload) 

        return (token)
        

    }




    async userSignup(signupCredentials : authSignupDto){

        const {email , password ,repassword ,name } =signupCredentials; 

        if(password !== repassword){
            throw new NotFoundException("Passwords do not match")
        }

        const results = await this.adminModel.find({
            email
        })
       if(results.length > 0 )
       {
             throw new NotFoundException("Email already exists")
       }
        try{
            const salt = await bcrypt.genSalt()
            const hash = await this.generateHash(password , salt)
            const newUser = await this.adminModel.create({
                email : email,
                password : hash ,
                name : name,
                salt : salt
            })

         await newUser.save()
            return {
                message : "AdminCreated" ,
                userId : newUser._id}
        }catch(error){
            return error
        }

    }


    async generateHash(password:string ,salt :string){
        const hash = await bcrypt.hash(password ,salt)
        return hash
    }

}
