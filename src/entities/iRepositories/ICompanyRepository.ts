
import { JobDataPropsState, JobPostRule, changeJobStatusProps, EmployerDetailsRule } from "../rules/companyRules";
import { JobApplication, JobApplicationJobDetailState } from "../rules/commonRules";

export default interface ICompanyRepository {
    companyExists(email: string): Promise<{success: boolean, companyData?: EmployerDetailsRule}>;
    tempOtp(otp: string, employerData: EmployerDetailsRule): Promise<{created: boolean}>
    findOtpAndCompany(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: EmployerDetailsRule}>
    createCompany(employerData: EmployerDetailsRule): Promise<{created: boolean}>
    companyLoginRepo(email: string, password: string): Promise<{userData?: EmployerDetailsRule, success: boolean, message: string}>
    companyUpdateFieldByEmailRepo(email: string, value: string, field: string): Promise<{success: boolean, message?: string}>
    companyUpdateFieldByIdRepo(id: string, updateData: any): Promise<{success: boolean}>
    companyJobPostRepo(jobData: JobDataPropsState): Promise<boolean>;
    getAllJobsRepo(companyId: string): Promise<{success: boolean, jobs?: JobPostRule[]}>;
    updateJobsFieldRepo(data: changeJobStatusProps): Promise<boolean>;
    editProfileRepo(data: JobDataPropsState): Promise<boolean>;
    getApplicantsRepo(companyId: string): Promise<{success: boolean; applications?: JobApplication[]}>
}
