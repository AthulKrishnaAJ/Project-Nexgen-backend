import { Request, Response } from "express";

//files
import ICompanyAuthInteface from "../../../entities/company/ICompanyAtuhInteractor"

//types
import httpStatus from "../../../entities/rules/httpStatusCodes";
import { EmployerDetailsRule } from "../../../entities/rules/companyRules";

class CompanyAuthController {
    private interactor: ICompanyAuthInteface

    constructor(interactor: ICompanyAuthInteface){
        this.interactor = interactor
    }

    employerSendOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const employerData: EmployerDetailsRule = req.body
            console.log('user data: ',  employerData)

            if(!employerData.email){
                return res.status(httpStatus.BAD_REQUEST).json({success: false, message: 'Email is required'})
            }

            const response = await this.interactor.sendOtp(employerData)
    
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


    employerVerifyOtpControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email, otp} = req.body
            if(!email || !otp){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: 'Otp is required'});
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


    employerLoginControl = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email, password} = req.body

            console.log('Enter employer login control with email and password: ', email)
            const response = await this.interactor.login(email, password)
            if(response.success){
                res.cookie('RefreshToken', response.refreshToken, {
                    httpOnly: true,
                    secure: true,  
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: '/employer'
                })

                res.cookie('AccessToken', response.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 15 * 60 * 1000,
                    path: '/employer'
                })

             return res.status(httpStatus.OK).json({employerData: response.userData, status: true, message: response.message})
            }
        } catch (error: any) {
            console.error('Error in employerLogin control at company auth controller: ', error)
            const {message} = error
            if(message === 'Invalid email or password, Please try again' || message === 'Access denied. Your account is blocked'){
                return res.status(httpStatus.BAD_REQUEST).json({status: false, message: message})
            }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message: 'Something went wrong please try again'})

        }
    }

}

export default CompanyAuthController