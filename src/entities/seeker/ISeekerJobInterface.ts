
import { GetAllJobsState } from "../rules/companyRules"

interface ISeekerJobInterface {
    getAllJobCase(): Promise<{jobs?: GetAllJobsState[], statusCode: number}>
}

export default ISeekerJobInterface