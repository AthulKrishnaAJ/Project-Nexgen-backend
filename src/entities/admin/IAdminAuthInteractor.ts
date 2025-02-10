import { AdminLoginData } from "../rules/adminRules";

interface IAdminAuthInterface {
    adminLoginCase(email: string, password: string): Promise<{adminData?: AdminLoginData, success: boolean, message: string, adminRefreshToken?: string}>;
}
export default IAdminAuthInterface