
import { SeekerEditProfilePayloadRule, SeekerDataForStore, SeekerFetchingDetailsRule, seekerDetailsRule } from "../rules/seekerRules"

interface ISeekerProfileInterfce {
    editProfileCase(data: SeekerEditProfilePayloadRule): Promise<{success:boolean, message: string, statusCode: number, user: SeekerDataForStore}>
    getSeekerCase(seekerId: string): Promise<{success: boolean, statusCode: number, seeker?: seekerDetailsRule}>
    uploadResumeCase(seekerId: string, filePath: string, fileName: string, mimetype: string): Promise<{success: boolean; statusCode: number}>;
    addSkillCase(seekerId: string, skill: string): Promise<{message: string, statusCode: number}>;
    removeSkillCase(seekerId: string, skill: string): Promise<{ statusCode: number; }>;
    removeResumeCase(seekerId: string, fileName: string): Promise<{statusCode: number}>;
}

export default ISeekerProfileInterfce