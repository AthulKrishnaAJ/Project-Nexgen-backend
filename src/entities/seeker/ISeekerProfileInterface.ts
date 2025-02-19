
import { SeekerEditProfilePayloadRule, SeekerDataForStore, SeekerFetchingDetailsRule, seekerDetailsRule } from "../rules/seekerRules"

interface ISeekerProfileInterfce {
    editProfileCase(data: SeekerEditProfilePayloadRule): Promise<{success:boolean, message: string, statusCode: number, user: SeekerDataForStore}>
    getSeekerCase(seekerId: string): Promise<{success: boolean, statusCode: number, seeker?: seekerDetailsRule}>
}

export default ISeekerProfileInterfce