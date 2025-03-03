
import AppError from "../../frameworks/utils/errorInstance";
import httpStatus from "../../entities/rules/httpStatusCodes";

//Types and interfaces
import ICompanyProfileInterface from "../../entities/company/ICompanyProfileInterface";
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { EmployerDetailsRule } from "../../entities/rules/companyRules";



class compannyProfileCases implements ICompanyProfileInterface {
    private repository: ICompanyRepository
    private commonRepository: ICommonRepository

    constructor(repository: ICompanyRepository, commonRepo: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepo
    }

    async getCompnayCase(companyId: string): Promise<{companyData: EmployerDetailsRule; statusCode:number}> {
        try {
            const response = await this.commonRepository.getCompanyByIdRepo(companyId)
            if(!response.success || !response.company){
                throw new AppError('Somthing went wrong', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {companyData: response.company, statusCode: httpStatus.OK}
        } catch (error: any) {
            console.error('Error in getCompnayCase at usecase/company/companyProfileCases: ', error.message)
            throw error
        }
    }
}

export default compannyProfileCases