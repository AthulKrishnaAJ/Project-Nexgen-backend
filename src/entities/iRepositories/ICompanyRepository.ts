
import { EmployerDetailsRule } from "../rules/companyRules"

export default interface ICompanyRepository {
    companyExists(email: string): Promise<{success: boolean, companyData?: EmployerDetailsRule}>;
    tempOtp(otp: string, employerData: EmployerDetailsRule): Promise<{created: boolean}>
    findOtpAndCompany(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: EmployerDetailsRule}>
    createCompany(employerData: EmployerDetailsRule): Promise<{created: boolean}>
    companyLoginRepo(email: string, password: string): Promise<{userData?: EmployerDetailsRule, success: boolean, message: string}>
    companyUpdateFieldByEmailRepo(email: string, value: string, field: string): Promise<{success: boolean, message?: string}>
    companyUpdateFieldByIdRepo(id: string, updateData: any): Promise<{success: boolean}>
    
}
