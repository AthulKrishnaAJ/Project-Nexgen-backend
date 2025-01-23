
export default interface ICommonRepository{
    saveOtpAndEmail(email: string, otp: string): Promise<{stored: boolean}>;
    verifyOtpAndEmail(email: string,otp: string): Promise<{success: boolean, message?: string}>
}