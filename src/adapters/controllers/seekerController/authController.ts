import { Request, Response } from "express";


//files
import ISeekerAuthInterface from "../../../entities/seeker/iSeekerAuthInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";

//types
import { seekerDetailsRule } from "../../../entities/rules/seekerRules";

class AuthController {
    private interactor: ISeekerAuthInterface

    constructor(interactor: ISeekerAuthInterface) { 
        this.interactor = interactor
      
    }

      sendOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const userData: seekerDetailsRule = req.body
            console.log('user data: ',  userData)

            if(!userData.email){
                return res.status(httpStatus.BAD_REQUEST).json({success: false, message: 'Email is required'})
            }

            const response = await this.interactor.sendOtp(userData)
    
            if(response.success){
                return res.status(httpStatus.OK).json({success: true, message: response.message})
            }

            if(!response.success && response.message === 'Email already in use'){
                return res.status(httpStatus.CONFLICT).json({success: false, message: response.message})
            }

            if(!response.success && response.message === 'Something went wrong, cannot send otp to your mail'){
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: response.message})
            }

            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: 'An unknown error, please try again'})

        } catch (error: any) {
            console.error('Error in sendOtpControl: ', error.message)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: 'Internal server error occured'})
        }
    }

    verifyOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email, otp} = req.body
            if(!email || !otp){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: 'Email and Otp are required'});
            }
            const response = await this.interactor.verifyOtp(otp, email)

            if(!response.success &&
                 (response.message === 'Invalid Otp' || response.message === 'Failed to create your account please try again')
                ){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: response.message})
            } else if(!response.success && response.message === 'Email already in use'){
                return res.status(httpStatus.CONFLICT).json({status: false, message: response.message})
            }
           return res.status(httpStatus.OK).json({status: true, message: response.message})
        } catch (error: any) {
            console.error('Error occur while creating account in verifyOtpControl: ', error.message)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message: 'Internal server error occured'})
        }
    }


    resendOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email} = req.body

            if(!email){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: 'Email cannot find'});
            }

            const response = await this.interactor.resendOtp(email)

            if(response.success){
                return res.status(httpStatus.OK).json({status: true, message: response.message})
            } else if(response.message === 'Email not found. Please signup again'){
                return res.status(httpStatus.NOT_FOUND).json({status: false, message: response.message})
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message: response.message})
            }

        } catch (error: any) {
            console.error('Error occured while resending otp at resendOtpControl: ', error.message)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message: 'An unexpected error occur'})
        }
    }
}

export default AuthController
