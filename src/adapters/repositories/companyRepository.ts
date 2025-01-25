import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository";
import employerModel from "../../frameworks/database/mongoDB/models/employerSchema";
import redisClient from "../../frameworks/database/redis/redisConnection";
import { EmployerDetailsRule } from "../../entities/rules/companyRules";
import { hashPassword, comparePassword } from "../../frameworks/services/passwordService";

class CompanyRepository implements ICompanyRepository {

    async employerExists(email: string): Promise<boolean> {
        try {
            const employerAlreadyExist = await employerModel.findOne({email: email})
            console.log('employer exist: ', employerAlreadyExist)
            if(!employerAlreadyExist){
                console.log('enter in false condition')
                return false
            }
            console.log('return true afte finding seekr')
            return true
        } catch (error: any) {
            console.error('Error in finding seeker at employerRepository: ', error.message)
            return false
        }
    }

    async tempOtp(otp: string, userData: EmployerDetailsRule):Promise<{ created: boolean }> {
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

    async findOtpAndEmployer(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: EmployerDetailsRule}> {
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

    async createEmployer(userData: EmployerDetailsRule): Promise<{created: boolean}> {
        try{
            const hashedPassword = await hashPassword(userData.password as string)
       
            const newSeeker = await employerModel.create({
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

    async employerLoginRepo(email: string, password: string): Promise<{ userData?: EmployerDetailsRule; success: boolean; message: string; }> {
        try {
            const findEmployer = await employerModel.findOne({email: email})
            if(!findEmployer){
                return {success: false, message: 'Incorrect email'}
            }

            const isPassword = await comparePassword(password, findEmployer.password as string)
            if(!isPassword){
                return {success: false, message: 'Incorrect password'}
            }

            if(findEmployer.blocked){
                return {success: false, message: 'Access denied. Your account is blocked'}
            }
            const user: EmployerDetailsRule = {
                id: findEmployer._id,
                firstName: findEmployer.firstName,
                lastName: findEmployer.lastName,
                email: findEmployer.email,
                mobile: findEmployer.mobile,
                blocked: findEmployer.blocked
            }
            return {userData: user, success: true, message: 'Login successful'}
        } catch (error: any) {
            console.error('Error in employerLoginRepo at company repository: ', error.message)
            throw new Error('Somthing went wrong')
        }
    }

    async employerUpdateFieldRepo(email: string, value: string, field: string): Promise<{ success: boolean; message?: string; }> {
        try {
            const updateData = {[field]: value}
            const updateField = await employerModel.updateOne({email}, {$set: updateData})

            if(updateField.modifiedCount === 0){
                return {success: false}
            }
            return {success: true, message: `${field} updated`}
        } catch (error: any) {
            console.error('Error in employerUpdateFieldRepo at repository/companyRepository: ', error.message)
            return {success: false}
        }
    }

}

export default CompanyRepository