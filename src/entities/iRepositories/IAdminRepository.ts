import { UserDataForAdmin, CompanyDataForAdmin } from "../rules/adminRules";

interface IAdminRepository {
    adminValidEmailAndPasswordRepo(email: string, passowrd: string): Promise<boolean>;
    getAllUsersRepo(projection: Record<string, number>): Promise<{userData?: UserDataForAdmin[], success: boolean}>
    findUserAndUpdate(id: string, field: string, value: any, projection?: Record<string, number>): Promise<{ userData?: UserDataForAdmin; success: boolean; }>
    getAllCompaniesRepo(projection: Record<string, number>): Promise<{companiesData?: CompanyDataForAdmin[], success: boolean}>
    findCompanyByIdAndUpdate(id: string, updatedData: any, projection: Record<string, number>): Promise<{companyData?: CompanyDataForAdmin; success: boolean}>
}


export default IAdminRepository