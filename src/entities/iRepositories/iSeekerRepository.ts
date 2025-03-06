
import { seekerDetailsRule, SeekerEditProfileRule, JobApplyProps } from "../rules/seekerRules"

export default interface ISeekerRepository {
    seekerExists(email: string): Promise<boolean>;
    tempOtp(otp: string, userData: seekerDetailsRule): Promise<{created: boolean}>;
    findOtpAndSeeker(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: seekerDetailsRule}>;
    createSeeker(userData: seekerDetailsRule): Promise<{created: boolean}>;
    loginSeeker(email: string, password: string): Promise<{user?: seekerDetailsRule, success: boolean, message: string}>;
    findUserDataByEmail(email: string): Promise<{userData?: seekerDetailsRule, success: boolean}>;
    updateField(email: string, value: string, field: string): Promise<{success: boolean, message?: string}>;
    updateSeekerDataById(seekerId: string, seekerData: SeekerEditProfileRule): Promise<boolean>;
    getSeekerDetails(seekerId: string): Promise<{success: boolean, seeker?:seekerDetailsRule}>;
    updateSeekerArrayFields (seekerId: string, field: string, data: string): Promise<boolean>;
    removeSeekerArrayValues(seekerId: string, field: string, value: string): Promise<boolean>
    applicationCreateRepo(data: JobApplyProps): Promise<{created: boolean; message?: string, applicationId?: string}>
    updateJobWithApplicationIdRepo(jobId: string, applicationId: string): Promise<boolean>;
    googleAuthenticationSeekerRepo(email: string, firstName: string, lastName: string): Promise<{user?: seekerDetailsRule, success: boolean}>
}