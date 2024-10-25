import { IsNotEmpty } from "class-validator"

export class CategoryDto{

    @IsNotEmpty()
    type:string

    subType:string
}   