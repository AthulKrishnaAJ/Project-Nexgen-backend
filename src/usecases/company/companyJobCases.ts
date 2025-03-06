import ICompanyJobInterface from "../../entities/company/ICompanyJobInteractor"
import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { JobDataPropsState, JobPostRule, changeJobStatusProps } from "../../entities/rules/companyRules"
import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"

class CompanyJobCases implements ICompanyJobInterface {
    private repository: ICompanyRepository
    private commonRepository: ICommonRepository

    constructor(repository: ICompanyRepository, commonRepository: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepository
    }

    async jobPostCase(jobData: JobDataPropsState): Promise<{success: boolean, message: string}> {
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

    async getAllJobsCase(companyId: string): Promise<{success: boolean, statusCode:number, jobs?: JobPostRule[]}> {
        try {
            const response = await this.repository.getAllJobsRepo(companyId)
            if(!response.success){
                throw new AppError('Something went wrong, cannot find jobs', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: response.success, statusCode: httpStatus.OK, jobs: response.jobs}
        } catch (error: any) {
            console.error('Error in getAllJobsCase at companyJobCases/usecases: ', error.message)
            throw error
        }
    }

    async changeJobStatusCase(data: changeJobStatusProps): Promise<{success:boolean, message:string, statusCode:number}> {
        try {
            const response = await this.repository.updateJobsFieldRepo(data)
            if(!response){
                throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: true, message: 'Status changed', statusCode:httpStatus.OK}
        } catch (error: any) {
            console.error('Error in changeJobStatusCase at companyJobCases/usecases: ', error.message)
            throw error
        }
    }

    async editJobCase(jobData: JobDataPropsState): Promise<{statusCode: number; message: string}> {
        try {
            console.log('Job data in usecase: ', jobData)
            const response = await this.repository.editProfileRepo(jobData)
            if(!response){
                throw new AppError('Something went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {statusCode: httpStatus.OK, message: 'Job has been updated'}
        } catch (error: any) {
            console.error('Error in editJobCase at companyJobCases/usecases: ', error.message)
            throw error
        }
    }
}

export default CompanyJobCases