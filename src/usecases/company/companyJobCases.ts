import ICompanyJobInterface from "../../entities/company/ICompanyJobInteractor"
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { JobPostDataState } from "../../entities/rules/companyRules"
import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"

class CompanyJobCases implements ICompanyJobInterface {
    private repository: ICompanyRepository
    private commonRepository: ICommonRepository

    constructor(repository: ICompanyRepository, commonRepository: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepository
    }

    async jobPostCase(jobData: JobPostDataState): Promise<{success: boolean, message: string}> {
        try {
            const response = this.repository.companyJobPostRepo(jobData)
            if(!response){
                throw new AppError('Job posting failed, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }

        return {success: true, message: 'Job posted'}
        } catch (error: any) {
            console.error('Error in jobPostCase at companyJobCases/usecases: ', error.message)
            throw error
        }
    }
}

export default CompanyJobCases