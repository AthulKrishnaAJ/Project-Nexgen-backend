import ICompanySeekerInterface from "../../entities/company/ICompanySeekerInterface"
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"
import { JobApplication } from "../../entities/rules/commonRules"

class CompanySeekerCases implements ICompanySeekerInterface {
    private repository: ICompanyRepository
    private commonRepository: ICommonRepository
    
    constructor(repository: ICompanyRepository, commonRepo: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepo
    }

    async getApplicantsCase(compnayId: string): Promise<{statusCode: number; applications:JobApplication[]}> {
        try {
            const response = await this.repository.getApplicantsRepo(compnayId)
            if(!response.success || !response.applications){
                throw new AppError('Somthing went wrong, could not find applicants', httpStatus.INTERNAL_SERVER_ERROR)
            }
            console.log('Fetch applicationsssss: ', response.applications)
            return {statusCode: httpStatus.OK, applications: response.applications}
        } catch (error: any) {
            console.error('Error in getApplicants at usecase/company/companySeekerCases: ', error.message)
            throw error
        }
    }
}

export default CompanySeekerCases