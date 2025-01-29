import { IMailerInterface } from "../../entities/services/IMailerInteractor";
import generateOtp from "./generateOtp";
import mailService from "./mailService";

class Mailer implements IMailerInterface {

    async sendMail(email: string, subject?: string): Promise<{ otp?: string; success: boolean; }> {
        const otp: string = generateOtp()
        const response = await mailService(email, otp, subject)
        return {otp: otp, success: response.success}
    }


    async sendMailToClients(email: string, reason?: string): Promise<boolean> {
        const text = reason ? reason : 'Your account has been verified'
        const response = await mailService(email, undefined, undefined, text)
       return response.success
    }
}

export default Mailer