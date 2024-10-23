import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


const testingLogin ={

    email:"test@test",

    password:"test"
}

const testingSignup = {

    email:"test@test",
    password:"test",
    repassword : "test",
    name:"test-Signup"

}

const mockedBcrypt = ()=>({

    genSalt : jest.fn().mockReturnValue("Test-Salt")
})

const mockedJwtServiceFunctions = () =>({
    sign:jest.fn().mockReturnValue("Test-Sign")
})

const mockedauthModelFunctions = () =>({
    findOne : jest.fn(),
    find : jest.fn(),
    create : jest.fn()
})


describe("Testing authServices",()=>{

    let authService , jwtService , authModel;

    beforeEach(async()=>{


        const testingModule = await Test.createTestingModule({
            providers : [
                AuthService ,
                {
                    provide : JwtService ,
                    useFactory : mockedJwtServiceFunctions
                },
                {
                    provide : getModelToken("user"),
                    useFactory : mockedauthModelFunctions
                },
                {
                    provide : bcrypt,
                    useFactory : mockedBcrypt
                }
            ]
        }).compile()

        authService = await testingModule.get(AuthService) 
        jwtService = await testingModule.get(JwtService)
        authModel = await testingModule.get(getModelToken("user"))

    })
        
    describe("Testing Login" ,()=>{
        
        it("case : 1 , Invalid Email entered  , throw notFoundException" ,async()=>{
            authModel.findOne.mockReturnValue(undefined)
            try{
                await authService.userLogin(testingLogin)
            }catch(error){
                expect(error).toBeInstanceOf(NotFoundException);
            }                        
        })

        it("case : 2 , Invalid Password entered  , throw notFoundException" ,async()=>{
            authModel.findOne.mockReturnValue({
                email:"test@test.com",
                password : "test"
            })
            authService.generateHash = jest.fn().mockReturnValue("test2")
            try{
                await authService.userLogin(testingLogin)
            }catch(error){
                expect(error).toBeInstanceOf(NotFoundException);
            }                        
        })

        it("case : 3 , Recieve Token, Everything is fine" ,async()=>{
            authModel.findOne.mockReturnValue({
                email:"test@test.com",
                password : "test"
            })
            authService.generateHash = jest.fn().mockReturnValue("test")
           
            expect(await authService.userLogin(testingLogin)).toEqual("Test-Sign");                 
        })



    })

    describe("Testing ( SignUp )",()=>{

        it("case : 1 , got unmatched passwords " ,async()=>{

            try{
                await authService.userSignup({ 
                    email:"test@test",
                    password:"test",
                    repassword : "test2",
                    name:"test-Signup"
                })
            }catch(error){
                expect(error).toBeInstanceOf(NotFoundException)
            }


        })

        it("case : 2 , already existed Email sent , throw error " ,async()=>{

            authModel.find.mockReturnValue([
                { 
                    email:"test@test",
                    password:"test",
                    repassword : "test",
                    name:"test-Signup"
                }
            ])

            try{
                await authService.userSignup({ 
                    email:"test@test",
                    password:"test",
                    repassword : "test",
                    name:"test-Signup"
                })
            }catch(error){
                expect(error).toBeInstanceOf(NotFoundException)
            }


        })

        it("case : 3 every thing is fine so return Created admin",async()=>{

            authModel.find.mockReturnValue([])

            const save = jest.fn()
            authModel.create.mockResolvedValue({
                save ,
                
                 _id : "Test-ID"
            })

            const result = (await authService.userSignup({
                email:"test@test",
                password:"test",
                repassword : "test",
                name:"test-Signup"
            }))
            expect(result).toEqual(
                { message: 'AdminCreated', userId: 'Test-ID' }
            )


        })
        
    })

   

})