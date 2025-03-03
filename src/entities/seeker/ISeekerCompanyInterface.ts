import { CompanyDetailsState } from "../rules/commonRules"

interface ISeekerCompanyInterface {
    getAllCompaniesCase(): Promise<{companies: CompanyDetailsState[], statusCode: number}>
}

export default ISeekerCompanyInterface