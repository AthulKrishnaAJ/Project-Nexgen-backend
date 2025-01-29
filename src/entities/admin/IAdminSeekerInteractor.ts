
import { UserDataForAdmin } from "../rules/adminRules"

interface IAdminSeekerInterface {
    getAllUserCase(): Promise<{userData?: UserDataForAdmin[], success: boolean}>
    userBlockUnblockCase(seekerId: string, action: string): Promise<{userData?: UserDataForAdmin, success: boolean}>
}

export default IAdminSeekerInterface