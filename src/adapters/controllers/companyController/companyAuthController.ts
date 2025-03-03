import { Request, Response, NextFunction } from "express";

//files
import ICompanyAuthInteface from "../../../entities/company/ICompanyAtuhInteractor"

//types
import httpStatus from "../../../entities/rules/httpStatusCodes";
import { EmployerDetailsRule } from "../../../entities/rules/companyRules";


/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */


class CompanyAuthController {
    private interactor: ICompanyAuthInteface

    constructor(interactor: ICompanyAuthInteface){
        this.interactor = interactor
    }

    employerSendOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const employerData: EmployerDetailsRule = req.body
            console.log('user data: ',  employerData)

            if(!employerData.email){
                return res.status(httpStatus.BAD_REQUEST).json({success: false, message: 'Email is required'})
            }
            const response = await this.interactor.sendOtp(employerData)
            if(response.success){
                return res.status(httpStatus.OK).json({success: response.success, message: response.message})
            }
        } catch (error: any) {
            console.error('Error in sendOtpControl: ', error.message)
            next(error)
        }
    }


    employerVerifyOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, otp} = req.body
            const response = await this.interactor.verifyOtp(otp, email)
            return res.status(httpStatus.OK).json({status: true, message: response.message})
        } catch (error: any) {
            console.error('Error occur while creating account in verifyOtpControl: ', error.message)
            next(error)
        }
    }


    employerLoginControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, password} = req.body

            const response = await this.interactor.login(email, password)
            if(response.success){
                res.cookie('refreshToken', response.companyRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',  
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000,
                    path: '/'
                
                })

      
             return res.status(httpStatus.OK).json({employerData: response.userData, status: true, message: response.message})
            }
        } catch (error: any) {
            console.error('Error in employerLogin control at company auth controller: ', error)
            next(error)

        }
    }


    employerForgotPasswordEmailVeifyControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try{
            const {email} = req.body
            const response = await this.interactor.employerVerifyEmail(email)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        }catch (error: any){
            console.error('Error in employerForgotPasswordEmailVeifyControl at companyAuth controller: ', error.message)
            next(error)
        }
    }


    employerChangePasswordVerifyOtpControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, otp} = req.body
            const response = await this.interactor.employerOtpVerificaionForChangePasswordCase(email, otp)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        } catch (error: any) {
            console.error('Error in employerChangePasswordVerifyOtpControl at companyAuth controller: ', error.message)
            next(error)
        }
    }

    employerChangePasswordControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try{
            const {email, password} = req.body
            const response = await this.interactor.employerChangePasswordCase(email, password)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        }catch(error: any){
            console.error('Error in employerChangePasswordControl at companyAuth controller: ', error.message)
            next(error)
        }
    }

}

export default CompanyAuthController