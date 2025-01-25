
import { EmployerDetailsRule } from "../rules/companyRules"

export default interface ICompanyRepository {
    employerExists(email: string): Promise<boolean>
    tempOtp(otp: string, employerData: EmployerDetailsRule): Promise<{created: boolean}>
    findOtpAndEmployer(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: EmployerDetailsRule}>
    createEmployer(employerData: EmployerDetailsRule): Promise<{created: boolean}>
    employerLoginRepo(email: string, password: string): Promise<{userData?: EmployerDetailsRule, success: boolean, message: string}>
    employerUpdateFieldRepo(email: string, value: string, field: string): Promise<{success: boolean, message?: string}>
}