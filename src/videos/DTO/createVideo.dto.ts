import { IsNotEmpty } from "class-validator"

export class createVideoDto{
    @IsNotEmpty()
    title:string
    @IsNotEmpty()
    smallDescription:string
    @IsNotEmpty()
    category:string
    @IsNotEmpty()
    subCategory:string
    @IsNotEmpty()
    embedLink:string

    description:string
    thumbnail: File
}   