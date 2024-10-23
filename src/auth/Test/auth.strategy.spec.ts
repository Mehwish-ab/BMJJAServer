import { isUnionType } from "graphql"
import { Test } from '@nestjs/testing';
import { authStrategy } from '../auth.strategy';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';



const mockedAuthModel =() =>({
    findOne : jest.fn()
})


describe("Testing auth strategy " ,()=>{

    let authstrategy, authModel;

    beforeEach(async()=>{

        const testingModule =await Test.createTestingModule({
            providers :[
                authStrategy ,
                {
                    provide : getModelToken("user"),
                    useFactory :mockedAuthModel
                }
            ] 
        }).compile()
        
        authstrategy = await testingModule.get(authStrategy)
        authModel = await testingModule.get(getModelToken("user"))

    })

   

    it("If authorised user pop up , return id , email" ,async()=>{

        authModel.findOne.mockReturnValue({
            _id : "Test-Id" ,
            email : "test@test"
        })

        expect(await authstrategy.validate({
            id : "Test-Id" ,
            email : "test@test"
        })).toEqual({
            user : "test@test"
        })

    })

    it("If unauthorised user pop up , throw error" ,async()=>{

        authModel.findOne.mockReturnValue(null)

        try{
            await authstrategy.validate({
                id : "Test-Id" ,
                email : "test@test"
            })
        }catch(error){
            expect(error).toBeInstanceOf(UnauthorizedException)
        }


       

    })





})