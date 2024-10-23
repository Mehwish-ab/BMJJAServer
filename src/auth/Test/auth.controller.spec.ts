import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const mockedAuthService = () =>({
    userLogin : jest.fn(),
    userSignup : jest.fn()
}) 

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

describe("Testing Auth Controller",()=>{

    let authController,authService;
    beforeEach(async()=>{

        const testingModule = await Test.createTestingModule({
            providers : [
                AuthController,
                {
                    provide : AuthService,
                    useFactory : mockedAuthService
                }
            ]
        }).compile()

        authController = await testingModule.get(AuthController)
        authService = await testingModule.get(AuthService)

    })


    it("Testing ( userLogin )",async()=>{
        authService.userLogin.mockResolvedValue("Test-login")
        expect(await authController.userLogin(testingLogin)).toEqual("Test-login")
        expect(authService.userLogin).toHaveBeenCalled()
    })

    it("Testing ( userSignup ) " ,async()=>{
        authService.userSignup.mockResolvedValue("Test-signup")      
        expect(await authController.userSignup(testingLogin)).toEqual("Test-signup")
        expect(authService.userSignup).toHaveBeenCalled()  
    })

})