
import { UserDataForAdmin, CompanyDataForAdmin } from "../rules/adminRules";
import { JobPostRule, GetCompanyDetialsState } from "../rules/companyRules";

export default interface ICommonRepository{
    saveOtpAndEmail(email: string, otp: string): Promise<{stored: boolean}>;
    verifyOtpAndEmail(email: string,otp: string): Promise<{success: boolean, message?: string}>
    findUserById(id: string): Promise<{userData?: UserDataForAdmin, success: boolean}>
    findCompanyByEmail(email: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}>
    getAllJobsRepo():Promise<{success: boolean, jobs?:JobPostRule[]}>
    getCompaniesById(companyId: string[]): Promise<{success: boolean, companyDatas?: GetCompanyDetialsState[]}>;
}