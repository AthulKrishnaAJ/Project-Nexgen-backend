
import { UserDataForAdmin, CompanyDataForAdmin } from "../rules/adminRules";
import { JobPostRule, GetCompanyDetialsState, EmployerDetailsRule } from "../rules/companyRules";
import { CompanyDetailsState } from "../rules/commonRules";

export default interface ICommonRepository{
    saveOtpAndEmail(email: string, otp: string): Promise<{stored: boolean}>;
    verifyOtpAndEmail(email: string,otp: string): Promise<{success: boolean, message?: string}>
    findUserById(id: string): Promise<{userData?: UserDataForAdmin, success: boolean}>
    findCompanyByEmail(email: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}>
    getAllJobsRepo():Promise<{success: boolean, jobs?:JobPostRule[]}>;
    getCompaniesById(companyId: string[]): Promise<{success: boolean, companyDatas?: GetCompanyDetialsState[]}>;
    getAllCompaniesRepo(): Promise<{ success: boolean; company?: CompanyDetailsState[]}>
    getCompanyByIdRepo(companyId: string): Promise<{success: boolean, company?: EmployerDetailsRule | null}>;
    getSearchedJobsRepo(searchTerm: string, searchType: string): Promise<JobPostRule[]>
   
}