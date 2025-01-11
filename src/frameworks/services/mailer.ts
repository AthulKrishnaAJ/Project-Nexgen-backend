import { iMailerInterface } from "../../entities/services/iMailerInteractor";
import generateOtp from "./generateOtp";
import mailService from "./mailService";

class Mailer implements iMailerInterface {

    async sendMail(email: string): Promise<{ otp?: string; success: boolean; }> {
        const otp: string = generateOtp()
        const response = await mailService(email, otp)
        return {otp: otp, success: response.success}
    }
}

export default Mailer