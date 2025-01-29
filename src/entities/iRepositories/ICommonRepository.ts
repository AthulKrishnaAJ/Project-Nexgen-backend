
import { UserDataForAdmin, CompanyDataForAdmin } from "../rules/adminRules";

export default interface ICommonRepository{
    saveOtpAndEmail(email: string, otp: string): Promise<{stored: boolean}>;
    verifyOtpAndEmail(email: string,otp: string): Promise<{success: boolean, message?: string}>
    findUserById(id: string): Promise<{userData?: UserDataForAdmin, success: boolean}>
    findCompanyByEmail(email: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}>
}