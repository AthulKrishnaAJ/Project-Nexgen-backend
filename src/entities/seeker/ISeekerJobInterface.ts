
import { GetAllJobsState } from "../rules/companyRules"
import { JobApplyProps } from "../rules/seekerRules"

interface ISeekerJobInterface {
    getAllJobCase(): Promise<{jobs?: GetAllJobsState[], statusCode: number}>
    applyJobCase(data: JobApplyProps): Promise<{statusCode: number, message: string}>;
}

export default ISeekerJobInterface