//Files
import iSeekerRepository from "../../entities/IRepositories/ISeekerRepository";
import redisClient from "../../frameworks/database/redis/redisConnection";
import seekerModel from "../../frameworks/database/mongoDB/models/seekerSchema";
import { seekerDetailsRule } from "../../entities/rules/seekerRules";
import { hashPassword, comparePassword } from "../../frameworks/services/passwordService";


class SeekerRepository implements iSeekerRepository {

    async seekerExists(email: string): Promise<boolean> {
        try {
            const seekerAlreadyExist = await seekerModel.findOne({email: email})
            console.log('seeker exist: ', seekerAlreadyExist)
            if(!seekerAlreadyExist){
                return false
            }
            console.log('return true afte finding seekr')
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
            console.log('Storing OTP and employer data in redis')
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
            const hashedPassword = await hashPassword(userData.password as string)
       
            const newSeeker = await seekerModel.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.trim(),
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


    async loginSeeker(email: string, password: string): Promise<{user?: seekerDetailsRule, success: boolean, message: string}> {
        try {
            const findUser = await seekerModel.findOne({email: email})
            if(!findUser){
                return {success: false, message: 'Incorrect email'}
            }

            const isPassword = await comparePassword(password, findUser.password as string)
            if(!isPassword){
                return {success: false, message: 'Incorrect password'}
            }

            if(findUser.blocked){
                return {success: false, message: 'Access denied. Your account is blocked'}
            }

            const user:seekerDetailsRule = {
                id: findUser._id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                email: findUser.email,
                mobile: findUser.mobile,
                logo: findUser.logo,
                blocked: findUser.blocked
            }

            return {user: user, success: true, message: 'Login successful'}


        } catch (error: any) {
            console.error('Error in login seeker at seekerRespository: ', error.message)
            return {success: false, message: 'Something went wrong'}
        }
    }
}

    
 

export default SeekerRepository