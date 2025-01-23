import { Request, Response, NextFunction } from "express";


//files
import ISeekerAuthInterface from "../../../entities/seeker/ISeekerAuthInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";
import AppError from "../../../frameworks/utils/errorInstance";

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

    verifyOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, otp} = req.body
            if(!email || !otp){
                throw new AppError('Email and Otp are required', httpStatus.BAD_REQUEST)

            }
            const response = await this.interactor.verifyOtp(otp, email)
            return res.status(httpStatus.OK).json({status: true, message: response.message})
        } catch (error: any) {
            console.error('Error occur while creating account in verifyOtpControl: ', error.message)
            next(error)
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


    loginControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email, password} = req.body
            console.log('====>',email, password)
            const response = await this.interactor.login(email, password)
            if(!response.success){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: response.message})
            } else {
                res.cookie('RefreshToken', response.refreshToken,{
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path:'/'
                })
                res.cookie('AccessToken', response.accessToken,{
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 1000,
                    path: '/',
                })
                return res.status(httpStatus.OK).json({user: response.user, status: true, message: response.message})
            }
        } catch (error: any) {
            console.error('Error occur while login seeker at loginControl: ', error.message)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message: 'Somthing went wrong please try again'})
        }
    }

    emailVerifyControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email} = req.body
            const response = await this.interactor.verifyEmail(email)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error: any) {
            console.error('Error occur while verifiying email for forgot password at emailVerifyControl: ', error.message)
            next(error)
        }
    }

    changePassowrdVerifyOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, otp} = req.body
            const response = await this.interactor.otpVerificationForChangingPassword(email, otp)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error: any) {
            console.error('Error occur while verify OTP for changing password: ', error.message)
            next(error)
        }
    }
}

export default AuthController
