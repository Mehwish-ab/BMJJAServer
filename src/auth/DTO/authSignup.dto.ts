import { IsNotEmpty } from "class-validator"

export class authSignupDto{

    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    repassword : string
    
    @IsNotEmpty()
    name:string
}