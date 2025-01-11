import nodemailer from 'nodemailer'
import { mailDetails } from '../../entities/services/iMailerInteractor'
import dotenv from 'dotenv'
dotenv.config()


const mailService = async (email: string, otp?: string, subject?: string, text?: string): Promise<{success: boolean}> => {
    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: mailDetails.user,
            pass: mailDetails.password
        },
        tls: {
            rejectUnauthorized: false
        }
    })


    const info = {
        subject: subject !== undefined ? subject : 'Signup verfication mail from Nexgen',
        text: otp ? `Your OTP is ${otp}. Use this OTP to complete your signup process` : text
    }


    const mailOptions = {
        from: mailDetails.user,
        to: email,
        subject: info.subject,
        text: info.text
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Mail send at mail service')
        return {success: true}
    } catch (error: any) {
        console.log('Error in sending mail at mail service: ', error.message)
        return {success: false}
    }
}


export default mailService