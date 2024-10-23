import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './Model/auth.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authStrategy } from './auth.strategy';
 

@Module({

  imports :[
    JwtModule.register({
      secret : 'somesupersecretsecret',
      signOptions : {
        expiresIn : "24h"
      }
    })
    ,

    PassportModule.register({
      defaultStrategy : 'jwt' 
    })

    ,
    MongooseModule.forFeature([
      {name : "admin" , schema : adminSchema}
    ])

  ],

  controllers: [AuthController],
  providers: [AuthService ,authStrategy],
  exports : [authStrategy , PassportModule] 
})
export class AuthModule {}
