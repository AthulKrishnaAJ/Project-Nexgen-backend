import { EmployerDetailsRule } from "../rules/companyRules"

interface ICompanyAuthInteface {
    sendOtp(userData: EmployerDetailsRule): Promise<{success: boolean, message: string}>
    verifyOtp(otp: string, email: string): Promise<{success: boolean, message: string}>
    login(email: string, password: string): Promise<{userData?: EmployerDetailsRule, refreshToken?: string, accessToken?: string, success: boolean, message: string}>
    employerVerifyEmail(email: string): Promise<{success: boolean, message: string}>
    employerOtpVerificaionForChangePasswordCase(email: string, otp: string): Promise<{success: boolean, message: string}>
    employerChangePasswordCase(email: string, passowrd: string): Promise<{success: boolean, message: string}>
}
export default ICompanyAuthInteface