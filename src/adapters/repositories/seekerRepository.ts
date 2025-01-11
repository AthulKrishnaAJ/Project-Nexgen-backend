//Files
import iSeekerRepository from "../../entities/iRepositories/iSeekerRepository";
import redisClient from "../../frameworks/database/redis/redisConnection";
import seekerModel from "../../frameworks/database/mongoDB/models/seekerSchema";
import { seekerDetailsRule } from "../../entities/rules/seekerRules";
import { hashPassword } from "../../frameworks/services/passwordService";

class SeekerRepository implements iSeekerRepository {

    async seekerExists(email: string): Promise<boolean> {
        try {
            const seekerAlreadyExist = await seekerModel.findOne({email: email})

            if(!seekerAlreadyExist){
                return false
            }
                return true
        } catch (error: any) {
            console.error('Error in finding seeker at seekerRepository: ', error.message)
            return false
        }

    
    }

    async tempOtp(otp: string, userData: seekerDetailsRule):Promise<{ created: boolean }> {
        try{
            const expirationTime = 120
            
            const dataToStore = {
                otp,
                userData
            }

            await redisClient.set(userData.email, JSON.stringify(dataToStore), {
                EX: expirationTime
            });
            console.log('Storing OTP and user data in redis')
            return {created: true}
        }catch(error: any){
            console.log('Error storing OTP in redis: ', error.message)
            return {created: false}
        }
    }

    async findOtpAndSeeker(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: seekerDetailsRule}> {
        try {
            const data = await redisClient.get(email)
            
            if(!data){
                console.log('Data not exist in redis')
                return {success: false}
            }
      
            const {otp: storedOtp, userData} = JSON.parse(data)

            if(validateOtp){
                if(storedOtp === otp && userData.email === email){
                    console.log('Otp and email matched')
                    return {success: true, userData: userData}
                }
                console.log('Otp or email does not match')
                return {success: false}
            }

            if(userData.email !== email){
                console.log('Email not matched in findOtpAndSeeker at seeker repository')
                return {success: false}
            }

            console.log("Returning use data without validating otp in findOtpAndSeeker at seeker repository")
            return {success: true, userData: userData}
        } catch (error: any) {
            console.error('Error in finding user at seeker repository: ', error.message)
            return {success: false}
        }
    }


    async createSeeker(userData: seekerDetailsRule): Promise<{created: boolean}> {
        try{
            const hashedPassword = await hashPassword(userData.password)
       
            const newSeeker = await seekerModel.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                mobile: userData.mobile,
                password: hashedPassword
            })
            console.log('User created successfully: ', newSeeker)

            if(!newSeeker){
                return {created: false}
            }
            return {created: true}
        }catch(error: any){
            console.error('Error in creating user at seeker repository: ', error.message)
            return {created: false}
        }
    }
}

    
 

export default SeekerRepository