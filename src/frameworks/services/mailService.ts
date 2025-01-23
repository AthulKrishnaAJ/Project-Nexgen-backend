import nodemailer from 'nodemailer'
import { mailDetails } from '../../entities/services/IMailerInteractor'
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
        subject: subject !== undefined ? subject : 'Verfication mail from Nexgen',
        text: otp ? `Your OTP is ${otp}. Use this OTP to complete your process` : text
    }
    
    let htmlTemplate = `
        <!DOCTYPE html>
            <html>
                <head>
                    <style>
                                body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #F0FBFA;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 4px;
                                overflow: hidden;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            }
                            .navbar {
                                background-color: #24A484;
                                padding: 15px;
                                text-align: center;
                                color: #ffffff;
                                font-size: 18px;
                                font-weight: bold;
                            }
                            .content {
                                padding: 20px;
                                text-align: center;
                                background-color: #ffffff; 
                                color: #333333;
                            }
                            .otp-box {
                                font-size: 24px;
                                font-weight: bold;
                                color: #24A484;
                                margin: 5px 0; /* Reduced margin for tighter spacing */
               
                                display: inline-block;
                            }
                            .footer {
                                background-color: #f1f1f1;
                                padding: 10px;
                                text-align: center;
                                font-size: 12px;
                                color: #666666;
                            }
                            .footer, .container {
                                margin-bottom: 0; 
                            }
                    </style>
                </head>
                    <body>
                    <div class='container'>
                            <div class='navbar'>
                                Nexgen
                            </div>
                        <div class='content'>
                            <h3>Hello User,</h3>
                            <p>${otp ? 'Use the OTP below to complete your process': info.text}</p>
                            ${otp ? `<div class='otp-box'>${otp}</div>` : ''}
                            <p>Thank you for using Nexgen!</p>
                        </div>
                            <div class="footer">
                                &copy; ${new Date().getFullYear()} Nexgen Application. All rights reserved.
                            </div>
                    </div>
                </body>
            </html>
`

    const mailOptions = {
        from: mailDetails.user,
        to: email,
        subject: info.subject,
        html: htmlTemplate
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