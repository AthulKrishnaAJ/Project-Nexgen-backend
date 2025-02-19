import { JobPostDataState } from "../rules/companyRules"

export interface ICompanyJobInterface {
    jobPostCase(jobData: JobPostDataState): Promise<{success: boolean, message: string}>
}
export default ICompanyJobInterface 