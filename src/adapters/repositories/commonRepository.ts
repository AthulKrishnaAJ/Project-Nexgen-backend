
import IcommonRepository from "../../entities/IRepositories/ICommonRepository";
import redisClient from "../../frameworks/database/redis/redisConnection";


class CommonRepository implements IcommonRepository{

    async saveOtpAndEmail(email: string, otp: string): Promise<{stored: boolean}> {
        try {
            const expirationTime = 120
             const dataToStore = {
                otp,
                email
             }
             await redisClient.set(email, JSON.stringify(dataToStore), {
                EX: expirationTime
             })
             console.log('OTP and email saved in redis')
             return {stored: true}
        } catch (error: any) {
            console.error('Error saving OTP and email in redis: ', error.message)
            return {stored: false}
        }
    }

    async verifyOtpAndEmail(email: string, otp: string): Promise<{success: boolean, message?: string}> {
        try {
            const storedData = await redisClient.get(email)
            if(!storedData) {
                console.error('Data not exist in redis')
                return {success: false, message: 'Data not found'}
            }
            const parseData = JSON.parse(storedData)
            const {otp: storedOtp, email: storedEmail} = parseData
            
            if(storedEmail === email && storedOtp === otp){
                return {success: true}
            }
            return {success: false}
       
        } catch (error: any) {
            console.error('Error in finding otp and email from redis at commonRepository: ', error.message)
            return {success: false, message: 'Somthing went wrong'}
        }
    }


}


export default CommonRepository