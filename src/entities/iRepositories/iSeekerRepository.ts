import { seekerDetailsRule } from "../rules/seekerRules"

export default interface iSeekerRepository {
    seekerExists(mail: string): Promise<boolean>
    tempOtp(otp: string, userData: seekerDetailsRule): Promise<{created: boolean}>
    findOtpAndSeeker(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: seekerDetailsRule}>
    createSeeker(userData: seekerDetailsRule): Promise<{created: boolean}>
    
}