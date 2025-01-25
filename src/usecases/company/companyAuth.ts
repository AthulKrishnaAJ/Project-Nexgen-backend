
import ICompanyAuthInteface from "../../entities/company/ICompanyAtuhInteractor";
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository";
import ICommonRepository from "../../entities/IRepositories/ICommonRepository";
import { EmployerDetailsRule } from "../../entities/rules/companyRules";
import IJwtSerivce from "../../entities/services/IJwtService";
import { IMailerInterface } from "../../entities/services/IMailerInteractor";
import AppError from "../../frameworks/utils/errorInstance";
import httpStatus from "../../entities/rules/httpStatusCodes";
import { hashPassword } from "../../frameworks/services/passwordService";


class CompanyAuth implements ICompanyAuthInteface {
    private repository: ICompanyRepository
    private mailer: IMailerInterface
    private jwtService: IJwtSerivce
    private commonRespository: ICommonRepository

    constructor(repository: ICompanyRepository, mailer: IMailerInterface, jwt: IJwtSerivce, commonRepo: ICommonRepository){
        this.repository = repository
        this.mailer = mailer
        this.jwtService = jwt
        this.commonRespository = commonRepo
    }

   async sendOtp(employerData: EmployerDetailsRule): Promise<{ success: boolean; message: string; }> {
        try {

            const isEmployerExist = await this.repository.employerExists(employerData.email.trim())

            if (!isEmployerExist) {
                const mailResponse = await this.mailer.sendMail(employerData.email)
                const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, employerData)

                if (mailResponse.success && storeOtpAndUserData.created) {
                    return { success: true, message: 'OTP send your email' }
                } else {
                    return { success: false, message: 'Something went wrong, cannot send otp to your mail' }
                }

            } else {
                console.log('Employer exist')
                return { success: false, message: 'Email already in use' }
            }
        } catch (error: any) {
            console.error('Error in sendOtp: ', error.message)
            return { success: false, message: 'Internal server error occur' }
        }
    }


    async verifyOtp(otp: string, email: string): Promise<{ success: boolean; message: string; }> {
        try {
            const isUserExist = await this.repository.employerExists(email.trim())

            if (!isUserExist) {
                console.log('user not exixiixix')
                const otpVerified = await this.repository.findOtpAndEmployer(email, otp, true)

                if (!otpVerified.success || !otpVerified.userData) {
                    throw new AppError('Invalid Otp', httpStatus.BAD_REQUEST)
                }

                const userCreation = await this.repository.createEmployer(otpVerified.userData)

                if (!userCreation.created) {
                    throw new AppError('Failed to create your account please try again', httpStatus.BAD_REQUEST)
                }
                return { success: true, message: 'Account created successful' }
            } else {
                console.log('user exixiixixxi');
                throw new AppError('Email already in use', httpStatus.CONFLICT)
            }

        } catch (error: any) {
            console.error('Error in verifyOtp at seekerAuth: ', error.message)
            throw error
        }
    }


    async login(email: string, password: string): Promise<{userData?: EmployerDetailsRule, refreshToken?: string, accessToken?: string, success: boolean, message: string}> {
        try {
            const validEmployer = await this.repository.employerLoginRepo(email, password)

            if(!validEmployer.success){
                if(validEmployer.message === 'Incorrect email' || validEmployer.message === 'Incorrect password'){
                    throw new Error('Invalid email or password, Please try again')
                }

                if(validEmployer.message === 'Access denied. Your account is blocked'){
                    throw new Error(validEmployer.message)
                }
            }

            const accessToken = this.jwtService.generateAccessToken({id: validEmployer.userData?.id, email: validEmployer.userData?.email, role: 'employer'}, {expiresIn: '1hr'})
            const refreshToken = this.jwtService.generateRefreshToken({id: validEmployer.userData?.id, email: validEmployer.userData?.email, role: 'employer'}, {expiresIn: '1d'})

            return {
                userData: validEmployer.userData, success: true, message: 'Login successful',
                accessToken: accessToken, refreshToken: refreshToken
            }
        } catch (error: any) {
            console.error('An error occured in login at companyAuth: ', error.message)
            throw error
        }
    }

    async employerVerifyEmail(email: string): Promise<{success: boolean, message: string}>{
        try {
            console.log('enter the case')
            const isEmployer = await this.repository.employerExists(email)
            if(!isEmployer){
                throw new AppError('Cannot found email, Please signup', httpStatus.NOT_FOUND)
            }
            const mailResponse = await this.mailer.sendMail(email, 'Verification mail from Nexgen for changing your passowrd')
            const storeOtpAndEmployerData = await this.commonRespository.saveOtpAndEmail(email, mailResponse.otp as string)

            if(!mailResponse.success || !storeOtpAndEmployerData.stored){
                throw new AppError('Somthing went wrong can"t sent otp to your mail, Please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }

            return{success: true, message: 'OTP sent your mail'}
        } catch (error: any) {
            console.error('Error in employerVerifyEmail at usecase/companyAuth: ', error.message)
            throw error
        }
    }

    async employerOtpVerificaionForChangePasswordCase(email: string, otp: string): Promise<{ success: boolean; message: string; }> {
        try {
            const otpAndEmailVerify = await this.commonRespository.verifyOtpAndEmail(email, otp)
            if(!otpAndEmailVerify.success){
                if(otpAndEmailVerify.message === 'Data not found' || otpAndEmailVerify.message === 'Somthing went wrong'){
                    throw new AppError('Something went wrong, please verify the email again', httpStatus.INTERNAL_SERVER_ERROR)
                } else {
                    throw new AppError('Invalid OTP', httpStatus.BAD_REQUEST)
                }
            }
            return {success: true, message: 'OTP verified'}
        } catch (error: any) {
            console.error('Error in employerOtpVerificaionForChangePasswordCase at usecase/companyAuth: ', error.message)
            throw error
        }
    }

    async employerChangePasswordCase(email: string, passowrd: string): Promise<{success: boolean, message: string}> {
        try {
            const hashedPassword = await hashPassword(passowrd)
            const isPasswordUpdate = await this.repository.employerUpdateFieldRepo(email, hashedPassword, 'password')
            
            if(!isPasswordUpdate.success){
                throw new AppError('Something went wrong, Please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: isPasswordUpdate.success, message: 'Password updated successful'}
        } catch (error: any) {
            console.error('Error in employerChangePasswordCase at usecase/companyAuth: ', error.message)
            throw error
        }
    }
}

export default CompanyAuth