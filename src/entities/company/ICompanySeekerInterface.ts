import { JobApplication } from "../rules/commonRules";

interface ICompanySeekerInterface {
    getApplicantsCase(compnayId: string): Promise<{statusCode: number; applications:JobApplication[]}>
}
export default ICompanySeekerInterface