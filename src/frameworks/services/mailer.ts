import { IMailerInterface } from "../../entities/services/IMailerInteractor";
import generateOtp from "./generateOtp";
import mailService from "./mailService";

class Mailer implements IMailerInterface {

    async sendMail(email: string, subject?: string): Promise<{ otp?: string; success: boolean; }> {
        const otp: string = generateOtp()
        const response = await mailService(email, otp, subject)
        return {otp: otp, success: response.success}
    }
}

export default Mailer