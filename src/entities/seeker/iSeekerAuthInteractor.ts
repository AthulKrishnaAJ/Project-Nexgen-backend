import { seekerDetailsRule } from "../rules/seekerRules"

interface ISeekerAuthInterface {
    sendOtp(userData: seekerDetailsRule): Promise<{success: boolean, message: string}>
    verifyOtp(otp: string, email: string): Promise<{success: boolean, message: string}>
    resendOtp(email: string): Promise<{success: boolean, message: string}>
    login(email: string, password: string): Promise<{user?: seekerDetailsRule, success: boolean, message: string, seekerRefreshToken?: string}>
    verifyEmail(email: string): Promise<{success: boolean, message: string}>
    otpVerificationForChangingPassword(email: string, otp: string): Promise<{success: boolean, message: string}>
    changePasswordCase(email: string, password: string): Promise<{success: boolean, message: string}>
}


export default ISeekerAuthInterface

