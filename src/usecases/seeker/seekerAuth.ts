
//Files
import ISeekerAuthInterface from "../../entities/seeker/iSeekerAuthInteractor";
import iSeekerRepository from "../../entities/iRepositories/iSeekerRepository";
import { iMailerInterface } from "../../entities/services/iMailerInteractor";
import { seekerDetailsRule } from "../../entities/rules/seekerRules";

class UserAuth implements ISeekerAuthInterface {
    private repository: iSeekerRepository
    private mailer: iMailerInterface

    constructor(repository: iSeekerRepository, mailer: iMailerInterface) {
        this.repository = repository
        this.mailer = mailer
     }

    async sendOtp(userData: seekerDetailsRule): Promise<{ success: boolean, message: string }> {

        try {
            
            const isUserExist = await this.repository.seekerExists(userData.email)
     
            if(!isUserExist){
                const mailResponse = await this.mailer.sendMail(userData.email)
                const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, userData)
         
                if(mailResponse.success && storeOtpAndUserData.created){
                    return {success: true, message: 'OTP send your email'}
                } else {
                    return {success: false, message: 'Something went wrong, cannot send otp to your mail'}
                }
    
            } else {
                return {success: false, message: 'Email already in use'}
            }
        } catch (error: any) {
            console.error('Error in sendOtp: ', error.message)
            return {success: false, message: 'Internal server error occur'}
        }
    }


    async verifyOtp(otp: string, email: string): Promise<{ success: boolean; message: string; }> {
        try {
            const isUserExist = this.repository.seekerExists(email)
            
            if(!isUserExist){
                const otpVerified = await this.repository.findOtpAndSeeker(email, otp, true)
    
                if(!otpVerified.success || !otpVerified.userData){
                    return {success: false, message: 'Invalid Otp'}
                }
    
                const userCreation = await this.repository.createSeeker(otpVerified.userData)
    
                if(!userCreation.created){
                    return {success: false, message: 'Failed to create your account please try again'}
                }
    
                return {success: true, message: 'Account created successfully'}
            } else {
                return {success: false, message: 'Email already in use'}
            }
           
        } catch (error: any) {
            console.error('Error in verifyOtp at seekerAuth: ', error.message)
            return {success: false, message: 'Something went wrong please try again'}
        }
    }


    async resendOtp(email: string): Promise<{success: boolean, message: string}> {
        try {
            const findSeeker = await this.repository.findOtpAndSeeker(email, undefined, false)

            if(!findSeeker.success || !findSeeker.userData){
                return {success: false, message: 'Email not found. Please signup again'}
            }

            const mailResponse = await this.mailer.sendMail(findSeeker.userData.email)
            const storeOtpAndUserData = await this.repository.tempOtp(mailResponse.otp as string, findSeeker.userData)

            if(mailResponse.success && storeOtpAndUserData.created){
                return {success: true, message: 'OTP resend your mail'}
            } else {
                return {success: false, message: 'Something went wrong, cannot send otp to your mail'}
            }


        } catch (error: any) {
            console.log('Error in resendOtp: ', error.message)
            return {success: false, message: 'Failed to resend OTP. Please try again'}
        }
    }
}


export default UserAuth