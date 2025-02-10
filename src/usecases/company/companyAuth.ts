
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

            const isEmployerExist = await this.repository.companyExists(employerData.email.trim())

            if (!isEmployerExist.success) {
                const mailResponse = await this.mailer.sendMail(employerData.email)
                const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, employerData)

                if (mailResponse.success && storeOtpAndUserData.created) {
                    return { success: true, message: 'OTP send to your email' }
                } else {
                    throw new AppError('Something went wrong, cannot send otp to your mail', httpStatus.INTERNAL_SERVER_ERROR)
                }

            } else {
                console.log('Employer exist')
                const companyVerification = await this.handleCompanyVerificationStateCase(isEmployerExist.companyData as EmployerDetailsRule)
                return {success: companyVerification.success, message: companyVerification.message}
            }
        } catch (error: any) {
            console.error('Error in sendOtp: ', error.message)
            throw error
        }

    }


    async handleCompanyVerificationStateCase(company: EmployerDetailsRule): Promise<{success: boolean, message: string}> {
        try {
            if(company.verify === 'reject' && company.rejection?.expiryDate){
                const endDate = new Date(company.rejection.expiryDate)
       
                const currentDate = new Date()
                // currentDate.setMonth(currentDate.getMonth() + 8)
                if(currentDate < endDate){
                    const remainingDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                    throw new AppError(`Company has been rejected, Signup after ${remainingDays} days`, httpStatus.BAD_REQUEST)
                } else {
                    const mailResponse = await this.mailer.sendMail(company.email)
                    const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, company)

                    if (mailResponse.success && storeOtpAndUserData.created) {
                        return { success: true, message: 'Verification OTP send to your email' }
                    } else {
                        throw new AppError('Something went wrong, cannot send otp to your mail', httpStatus.INTERNAL_SERVER_ERROR)
                    }
                }
            }
            throw new AppError('Email already in use', httpStatus.CONFLICT)
        } catch (error: any) {
            console.error('Error in handleCompanyVerificationState at companyRepository: ', error.message)
            throw error
        }
    }



    async verifyOtp(otp: string, email: string): Promise<{success: boolean, message: string}> {
        try {
            const isUserExist = await this.repository.companyExists(email.trim())

            const otpVerified = await this.repository.findOtpAndCompany(email, otp, true)
            if (!otpVerified.success || !otpVerified.userData) {
                throw new AppError('Invalid Otp', httpStatus.BAD_REQUEST)
            }

            if (!isUserExist.success) {
                console.log('user not exixiixix')
                const userCreation = await this.repository.createCompany(otpVerified.userData)
                if (!userCreation.created) {
                    throw new AppError('Failed to create your account please try again', httpStatus.BAD_REQUEST)
                }

                return { success: true, message: 'Account created successful' }
            } else {
                console.log('user exixiixixxi');
                if(isUserExist?.companyData?.verify === 'reject'){
                    let updatedData = {
                        verify: 'pending',
                        rejection: {    
                            reason: null,
                            expiryDate: null
                        }
                    }
                    const rejectedCompany = await this.repository.companyUpdateFieldByIdRepo(isUserExist.companyData._id!.toString(), updatedData)
                    if(!rejectedCompany.success){
                        throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
                    }
                    return {success: true, message: 'Account verified'}
                }
                throw new AppError('Somthing went wrong while verifying your account', httpStatus.INTERNAL_SERVER_ERROR)
                
            }

        } catch (error: any) {
            console.error('Error in verifyOtp at seekerAuth: ', error.message)
            throw error
        }
    }


    async login(email: string, password: string): Promise<{userData?: EmployerDetailsRule, companyRefreshToken?: string, success: boolean, message: string}> {
        try {
            const validEmployer = await this.repository.companyLoginRepo(email, password)

            if(!validEmployer.success){
                if(validEmployer.message === 'Incorrect email' || validEmployer.message === 'Incorrect password'){
                    throw new AppError('Invalid email or password, Please try again', httpStatus.BAD_REQUEST)
                }
                throw new AppError(validEmployer.message, httpStatus.FORBIDDEN)
             
            }

            const accessToken = this.jwtService.generateAccessToken({id: validEmployer.userData?._id, email: validEmployer.userData?.email, role: 'company'}, {expiresIn: '1hr'})
            const refreshToken = this.jwtService.generateRefreshToken({id: validEmployer.userData?._id, email: validEmployer.userData?.email, role: 'company'}, {expiresIn: '1d'})

            if(validEmployer.userData){
                validEmployer.userData.accessToken = accessToken
                validEmployer.userData.role = 'company'
            }
            return {
                userData: validEmployer.userData, success: true, message: 'Login successful',
                companyRefreshToken: refreshToken
            }
        } catch (error: any) {
            console.error('An error occured in login at companyAuth: ', error.message)
            throw error
        }
    }



    async employerVerifyEmail(email: string): Promise<{success: boolean, message: string}>{
        try {
            console.log('enter the case')
            const isEmployer = await this.repository.companyExists(email)
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
            const isPasswordUpdate = await this.repository.companyUpdateFieldByEmailRepo(email, hashedPassword, 'password')
            
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