import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { authSignupDto } from './DTO/authSignup.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authservice : AuthService
    ){}

    @Post('/login')
    async userLogin(@Body() loginCredentials ){  
        const token = await this.authservice.userLogin(loginCredentials)
        return {token}
    }


    @Post('/signup')
    async userSignup(@Body(ValidationPipe) signupCredentials : authSignupDto ){
        return await this.authservice.userSignup(signupCredentials)
    }

    
}
