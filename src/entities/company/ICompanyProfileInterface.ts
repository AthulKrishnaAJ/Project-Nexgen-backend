
import { EmployerDetailsRule } from "../rules/companyRules";

interface ICompanyProfileInterface {
    getCompnayCase(companyId: string): Promise<{companyData: EmployerDetailsRule; statusCode:number}>;
}

export default ICompanyProfileInterface