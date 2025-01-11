import { seekerDetailsRule } from "../rules/seekerRules"

interface ISeekerAuthInterface {
    sendOtp(userData: seekerDetailsRule): Promise<{success: boolean, message: string}>
    verifyOtp(otp: string, email: string): Promise<{success: boolean, message: string}>
    resendOtp(email: string): Promise<{success: boolean, message: string}>
    
}


export default ISeekerAuthInterface