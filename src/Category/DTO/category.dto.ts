import { IsNotEmpty } from "class-validator"

export class CategoryDto{

    @IsNotEmpty()
    category:string
    @IsNotEmpty()
    subCategory:string
}   