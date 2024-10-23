import { PassportStrategy } from "@nestjs/passport";
import {Strategy , ExtractJwt } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { userInterface } from './Model/auth.model';
import { UnauthorizedException } from "@nestjs/common";


export class authStrategy extends PassportStrategy(Strategy){


    constructor(
        @InjectModel("admin")
        private adminModel : Model<userInterface>
    ){
        super({
            jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : 'somesupersecretsecret'
        })
    }

    async validate(payload){
        const { id } = payload.user;
        
        const user =  await this.adminModel.findById(id)
        if(!user){
            throw new UnauthorizedException()          
        }
        return user
    }
}