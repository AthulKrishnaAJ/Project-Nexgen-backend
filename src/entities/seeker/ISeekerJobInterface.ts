
import { GetAllJobsState } from "../rules/companyRules"
import { JobApplyProps, JobSearchProps } from "../rules/seekerRules"

interface ISeekerJobInterface {
    getAllJobCase(): Promise<{jobs?: GetAllJobsState[], statusCode: number}>
    applyJobCase(data: JobApplyProps): Promise<{statusCode: number, message: string}>;
    searchJobCase(searchTerm: string, searchType: string): Promise<{jobs?: GetAllJobsState[], statusCode: number}>;
}

export default ISeekerJobInterface