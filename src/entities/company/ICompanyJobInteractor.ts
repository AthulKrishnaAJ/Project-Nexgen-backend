import { JobDataPropsState, JobPostRule, changeJobStatusProps } from "../rules/companyRules"

export interface ICompanyJobInterface {
    jobPostCase(jobData: JobDataPropsState): Promise<{ success: boolean, message: string }>
    getAllJobsCase(companyId: string): Promise<{ success: boolean, statusCode: number, jobs?: JobPostRule[] }>
    changeJobStatusCase(data: changeJobStatusProps): Promise<{ success: boolean; message: string; statusCode: number }>
    editJobCase(jobData: JobDataPropsState): Promise<{statusCode: number; message: string}>
}
export default ICompanyJobInterface 