import { IsNotEmpty } from "class-validator"

export class authLoginDto{

    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    password:string
}   