import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"

//types and interfaces
import ISeekerJobInterface from "../../entities/seeker/ISeekerJobInterface"
import ISeekerRepository from "../../entities/IRepositories/iSeekerRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { GetAllJobsState } from "../../entities/rules/companyRules"
import { JobApplyProps } from "../../entities/rules/seekerRules"

class SeekerJobCases implements ISeekerJobInterface {
    private repository: ISeekerRepository
    private commonRepository: ICommonRepository

        constructor(repository: ISeekerRepository, commonRepo: ICommonRepository){
            this.repository = repository
            this.commonRepository = commonRepo
        }

        async getAllJobCase(): Promise<{jobs?: GetAllJobsState[], statusCode: number}> {
            try {
                const getJobs = await this.commonRepository.getAllJobsRepo()
                if(!getJobs.success){
                    throw new AppError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR)
                }
                const companyIds = [...new Set(getJobs.jobs?.map(job => job.companyId.toString()))]

                const companies = await this.commonRepository.getCompaniesById(companyIds)

                const companyMap = new Map(companies.companyDatas?.map((company) => [company._id.toString(), company.companyName]))

                const jobWithCompany = getJobs.jobs?.map(job => ({
                    ...job,
                    companyName: companyMap.get(job.companyId.toString())
                }))

                return {jobs: jobWithCompany, statusCode: httpStatus.OK}
            } catch (error: any) {
                console.error('Errror in getting all Jobs: ', error.message)
                throw error
            }
        }

        async applyJobCase(data: JobApplyProps): Promise<{statusCode: number, message: string}> {
            try {
                const createApplication = await this.repository.applicationCreateRepo(data)

                if(!createApplication.created){
                    if(createApplication.message === 'conflict'){
                        throw new AppError('Already applied this job', httpStatus.CONFLICT)
                    }
                    throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
                }
                console.log('job Id:==>',data.jobId)
                console.log('company Id: ==>', data.companyId)
                console.log('seekerId Id: ==>', data.seekerId)
                console.log( 'application Id:==>',createApplication.applicationId)
                
                const updateJob = await this.repository.updateJobWithApplicationIdRepo(data.jobId, createApplication.applicationId!)
                if(!updateJob){
                    throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
                }
                return {statusCode: httpStatus.OK, message: 'Application submitted'}
            } catch (error: any) {
                console.error('Error in applyJobCase at usecase/seekerJobCase: ', error.message)
                throw error
            }
        }
        
}


export default SeekerJobCases