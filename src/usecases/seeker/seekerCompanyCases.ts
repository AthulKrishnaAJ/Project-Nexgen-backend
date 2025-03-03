
import AppError from "../../frameworks/utils/errorInstance";
import httpStatus from "../../entities/rules/httpStatusCodes";

//interfaces and types
import ISeekerCompanyInterface from "../../entities/seeker/ISeekerCompanyInterface";
import ISeekerRepository from "../../entities/IRepositories/iSeekerRepository";
import ICommonRepository from "../../entities/IRepositories/ICommonRepository";
import { CompanyDetailsState } from "../../entities/rules/commonRules";


class SeekerCompanyCases implements ISeekerCompanyInterface {
    private repository: ISeekerRepository
    private commonRepository: ICommonRepository
    constructor(repository: ISeekerRepository, commonRepo: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepo
    }

    async getAllCompaniesCase(): Promise<{companies: CompanyDetailsState[], statusCode: number}> {
        try {
            const response = await this.commonRepository.getAllCompaniesRepo()
            if(!response.success || !response.company){
                throw new AppError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {companies: response.company, statusCode: httpStatus.OK}
        } catch (error: any) {
            console.error('Error in getAllCompaniesCase at usecase/seeker/getAllCompaniesCase', error.message)
            throw error
        }
    }
}

export default SeekerCompanyCases