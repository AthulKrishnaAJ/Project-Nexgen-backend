import { CompanyDataForAdmin } from "../rules/adminRules"

interface IAdminCompanyInterface {
    getAllCompaniesCase(): Promise<{companiesData?: CompanyDataForAdmin[], success: boolean}>
    companyVerificationCase(email: string, action: string, reason?: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}>
}
export default IAdminCompanyInterface