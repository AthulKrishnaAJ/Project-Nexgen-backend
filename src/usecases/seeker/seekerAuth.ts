
//Files
import ISeekerAuthInterface from "../../entities/seeker/iSeekerAuthInteractor";
import ISeekerRepository from "../../entities/iRepositories/iSeekerRepository";
import { IMailerInterface } from "../../entities/services/iMailerInteractor";
import { seekerDetailsRule } from "../../entities/rules/seekerRules";
import IJwtSerivce from "../../entities/services/IJwtService";

class UserAuth implements ISeekerAuthInterface {
    private repository: ISeekerRepository
    private mailer: IMailerInterface
    private jwtService: IJwtSerivce

    constructor(repository: ISeekerRepository, mailer: IMailerInterface, jwt: IJwtSerivce) {
        this.repository = repository
        this.mailer = mailer
        this.jwtService = jwt
    }

    async sendOtp(userData: seekerDetailsRule): Promise<{ success: boolean, message: string }> {

        try {

            const isUserExist = await this.repository.seekerExists(userData.email)

            if (!isUserExist) {
                const mailResponse = await this.mailer.sendMail(userData.email)
                const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, userData)

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
                    return { success: false, message: 'Invalid Otp' }
                }

                const userCreation = await this.repository.createSeeker(otpVerified.userData)

                if (!userCreation.created) {
                    return { success: false, message: 'Failed to create your account please try again' }
                }

                return { success: true, message: 'Account created successful' }
            } else {
                console.log('user exixiixixxi');
                return { success: false, message: 'Email already in use' }
            }

        } catch (error: any) {
            console.error('Error in verifyOtp at seekerAuth: ', error.message)
            return { success: false, message: 'Something went wrong please try again' }
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

    async login(email: string, password: string): Promise<{ user?: seekerDetailsRule, success: boolean, message: string, accessToken?: string, refreshToken?: string }> {
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


            return {
                 user: validUser.user, success: true, message: 'Login successful',
                 accessToken: accessToken, refreshToken: refreshToken 
                }

        } catch (error: any) {
            console.error('Error in login at seekerAuth: ', error.message)
            return { success: false, message: 'Failed to login. Please try again' }
        }
    }
}


export default UserAuth