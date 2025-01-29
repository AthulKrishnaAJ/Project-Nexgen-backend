interface IAdminAuthInterface {
    adminLoginCase(email: string, password: string): Promise<{adminData?: string, success: boolean, message: string, adminAccessToken?: string, adminRefreshToken?: string}>;
}
export default IAdminAuthInterface