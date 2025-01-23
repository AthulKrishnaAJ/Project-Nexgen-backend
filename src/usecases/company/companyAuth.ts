
import ICompanyAuthInteface from "../../entities/company/ICompanyAtuhInteractor";
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository";
import { EmployerDetailsRule } from "../../entities/rules/companyRules";
import IJwtSerivce from "../../entities/services/IJwtService";
import { IMailerInterface } from "../../entities/services/IMailerInteractor";


class CompanyAuth implements ICompanyAuthInteface {
    private repository: ICompanyRepository
    private mailer: IMailerInterface
    private jwtService: IJwtSerivce

    constructor(repository: ICompanyRepository, mailer: IMailerInterface, jwt: IJwtSerivce){
        this.repository = repository
        this.mailer = mailer
        this.jwtService = jwt
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
                    return { success: false, message: 'Invalid Otp' }
                }

                const userCreation = await this.repository.createEmployer(otpVerified.userData)

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
            throw new Error(error.message)
        }
    }
}

export default CompanyAuth