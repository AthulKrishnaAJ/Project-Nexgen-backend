
//Files
import ISeekerAuthInterface from "../../entities/seeker/ISeekerAuthInteractor";
import ISeekerRepository from "../../entities/IRepositories/ISeekerRepository";
import ICommonRepository from "../../entities/IRepositories/ICommonRepository";
import { IMailerInterface } from "../../entities/services/IMailerInteractor";
import { seekerDetailsRule } from "../../entities/rules/seekerRules";
import IJwtSerivce from "../../entities/services/IJwtService";
import AppError from "../../frameworks/utils/errorInstance";
import httpStatus from "../../entities/rules/httpStatusCodes";
import { hashPassword } from "../../frameworks/services/passwordService";

class UserAuth implements ISeekerAuthInterface {
    private repository: ISeekerRepository
    private mailer: IMailerInterface
    private jwtService: IJwtSerivce
    private commonRepository: ICommonRepository

    constructor(repository: ISeekerRepository, mailer: IMailerInterface, jwt: IJwtSerivce, commonRepo: ICommonRepository) {
        this.repository = repository
        this.mailer = mailer
        this.jwtService = jwt
        this.commonRepository = commonRepo
    }

    async sendOtp(userData: seekerDetailsRule): Promise<{ success: boolean, message: string }> {

        try {

            const isUserExist = await this.repository.seekerExists(userData.email)

            if (!isUserExist) {
                const mailResponse = await this.mailer.sendMail(userData.email)
                const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, userData)
                console.log('OTP>>>>>>>>>', mailResponse.otp)
                if (mailResponse.success && storeOtpAndUserData.created) {
                    return { success: true, message: 'OTP send your email' }
                } else {
                    return { success: false, message: 'Something went wrong, cannot send otp to your mail' }
                }

            } else {
                return { success: false, message: 'Email already in use' }
            }
        } catch (error: any) {
            console.error('Error in sendOtp: ', error.message)
            return { success: false, message: 'Internal server error occur' }
        }
    }


    async verifyOtp(otp: string, email: string): Promise<{ success: boolean; message: string; }> {
        try {
            const isUserExist = await this.repository.seekerExists(email.trim())

            if (!isUserExist) {
                console.log('user not exixiixix')
                const otpVerified = await this.repository.findOtpAndSeeker(email.trim(), otp, true)

                if (!otpVerified.success || !otpVerified.userData) {
                    throw new AppError('Invalid Otp', httpStatus.BAD_REQUEST)
                }

                const userCreation = await this.repository.createSeeker(otpVerified.userData)

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


    async resendOtp(email: string): Promise<{ success: boolean, message: string }> {
        try {
            const findSeeker = await this.repository.findOtpAndSeeker(email, undefined, false)

            if (!findSeeker.success || !findSeeker.userData) {
                return { success: false, message: 'Email not found. Please signup again' }
            }

            const mailResponse = await this.mailer.sendMail(findSeeker.userData.email)
            const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, findSeeker.userData)

            if (mailResponse.success && storeOtpAndUserData.created) {
                return { success: true, message: 'OTP resend your mail' }
            } else {
                return { success: false, message: 'Something went wrong, cannot send otp to your mail' }
            }


        } catch (error: any) {
            console.log('Error in resendOtp: ', error.message)
            return { success: false, message: 'Failed to resend OTP. Please try again' }
        }
    }

    async login(email: string, password: string): Promise<{ user?: seekerDetailsRule, success: boolean, message: string, seekerRefreshToken?: string }> {
        try {
            const validUser = await this.repository.loginSeeker(email, password)

            if (!validUser.success) {
                if (validUser.message === 'Incorrect email' || validUser.message === 'Incorrect password') {
                    return { success: false, message: 'Invalid email or password. Please try again' }
                }

                if (validUser.message === 'Access denied. Your account is blocked') {
                    return { success: false, message: validUser.message }
                }
            }
            const accessToken = this.jwtService.generateAccessToken({ id: validUser.user?.id, email: validUser.user?.email, role: 'user' }, { expiresIn: '1hr' })
            const refreshToken = this.jwtService.generateRefreshToken({ id: validUser.user?.id, email: validUser.user?.email, role: 'user' }, { expiresIn: '1d' })
        
            if(validUser.user){
                validUser.user.accessToken = accessToken
                validUser.user.role = 'user'
            }
       
            return {
                 user: validUser.user, success: true, message: 'Login successful',
                 seekerRefreshToken: refreshToken 
                }

        } catch (error: any) {
            console.error('Error in login at seekerAuth: ', error.message)
            return { success: false, message: 'Failed to login. Please try again' }
        }
    }


    async verifyEmail(email: string): Promise<{success: boolean, message: string}> {
        try {
            const isSeeker = await this.repository.seekerExists(email)
            if(!isSeeker){
                throw new AppError('Cannot found email, Please signup', httpStatus.NOT_FOUND)
            }
            const mailResponse = await this.mailer.sendMail(email, 'Verification mail from Nexgen for changing your passowrd')
            const storeOtpAndEmail = await this.commonRepository.saveOtpAndEmail(email, mailResponse.otp as string)

            if(!mailResponse.success || !storeOtpAndEmail.stored){
                throw new AppError('Something went wrong, cannot sent otp to your mail', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: true, message: 'OTP sent your email'}
        } catch (error: any) {
            console.error('Error in verifyEmail at usecases/seekerAtuh: ', error.message)
            throw error
        }
    }

    async otpVerificationForChangingPassword(email: string, otp: string): Promise<{ success: boolean; message: string; }> {
        try{
            const otpAndEmailVerify = await this.commonRepository.verifyOtpAndEmail(email, otp)
            if(!otpAndEmailVerify.success){
                if(otpAndEmailVerify.message === 'Data not found' || otpAndEmailVerify.message === 'Somthing went wrong'){
                    throw new AppError('Something went wrong, please verify the email again', httpStatus.INTERNAL_SERVER_ERROR)
                } else {
                    throw new AppError('Invalid OTP', httpStatus.BAD_REQUEST)
                }
            }
            return {success: true, message: 'OTP verified'}
        } catch(error: any){
            console.error('Error in otpVerificationForChangingPassword at usecase/seekerAuth: ', error.message)
            throw error
        }
    }

    async changePasswordCase(email: string, password: string): Promise<{success: boolean, message: string}> {
        try {
            const hashedPassword = await hashPassword(password)
            const isPasswordUpdate = await this.repository.updateField(email, hashedPassword, 'password')

            if(!isPasswordUpdate.success){
                if(isPasswordUpdate.message === 'No changes made'){
                    throw new AppError('Password already taken', httpStatus.CONFLICT)
                } else {
                    throw new AppError('Something went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
                }
            }
            return {success: isPasswordUpdate.success, message: 'Password updated successful'}
        } catch (error: any) {
            console.error('Error in changePasswordCase at usecase/seekerAuth: ', error.message)
            throw error
        }
    }
}


export default UserAuth