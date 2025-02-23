import { JobPostDataState, JobPostRule, changeJobStatusProps } from "../rules/companyRules"

export interface ICompanyJobInterface {
    jobPostCase(jobData: JobPostDataState): Promise<{ success: boolean, message: string }>
    getAllJobsCase(companyId: string): Promise<{ success: boolean, statusCode: number, jobs?: JobPostRule[] }>
    changeJobStatusCase(data: changeJobStatusProps): Promise<{ success: boolean; message: string; statusCode: number }>
}
export default ICompanyJobInterface 