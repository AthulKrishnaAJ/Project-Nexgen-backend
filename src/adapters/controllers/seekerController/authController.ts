import { Request, Response, NextFunction } from "express";


//files
import httpStatus from "../../../entities/rules/httpStatusCodes";
import AppError from "../../../frameworks/utils/errorInstance";

//types and interfaces
import { seekerDetailsRule } from "../../../entities/rules/seekerRules";
import ISeekerAuthInterface from "../../../entities/seeker/ISeekerAuthInteractor";


/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */


class AuthController {
    private interactor: ISeekerAuthInterface

    constructor(interactor: ISeekerAuthInterface) { 
        this.interactor = interactor
      
    }

      sendOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const userData: seekerDetailsRule = req.body
            console.log('user data: ',  userData)

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


    loginControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, password} = req.body
            console.log('====>',email, password)
            const response = await this.interactor.login(email, password)

            res.cookie('refreshToken', response.seekerRefreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })  
            return res.status(httpStatus.OK).json({user: response.user, status: true, message: response.message})
            
        } catch (error) {
            next(error)
        }
    }

    emailVerifyControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email} = req.body
            const response = await this.interactor.verifyEmail(email)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error) {
            next(error)
        }
    }

    changePassowrdVerifyOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, otp} = req.body
            const response = await this.interactor.otpVerificationForChangingPassword(email, otp)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error) {
            next(error)
        }
    }

    changePasswordControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, password} = req.body
            console.log('DAta =====> ', email, password)
            const response = await this.interactor.changePasswordCase(email, password)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error) {
            next(error)
        }
    }

    googleAuthControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {credential, clientId} = req.body
            const response = await this.interactor.googleAuthCase(credential, clientId)
            res.cookie('refreshToken', response.seekerRefreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })  
            return res.status(response.statusCode).json({status: true, message: response.message, user: response.seekerData})
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController
