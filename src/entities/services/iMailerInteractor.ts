import { mailConfigRule } from "../rules/commonRules"
import dotenv from 'dotenv'
dotenv.config()

export interface IMailerInterface {
    sendMail(email: string): Promise<{otp?: string, success: boolean}>
}

export const mailDetails = <mailConfigRule>{
    user: process.env.EMAIL,
    password: process.env.PASSWORD
}