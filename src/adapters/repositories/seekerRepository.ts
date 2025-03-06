
//Files
import iSeekerRepository from "../../entities/IRepositories/iSeekerRepository";
import redisClient from "../../frameworks/database/redis/redisConnection";
import { JobApplyProps, seekerDetailsRule, SeekerEditProfileRule } from "../../entities/rules/seekerRules";
import { hashPassword, comparePassword } from "../../frameworks/services/passwordService";

//models
import seekerModel from "../../frameworks/database/mongoDB/models/seekerSchema";
import jobApplicationModel from "../../frameworks/database/mongoDB/models/jobApplicationSchema";
import jobPostModel from "../../frameworks/database/mongoDB/models/jobPostSchema";


class SeekerRepository implements iSeekerRepository {

    async seekerExists(email: string): Promise<boolean> {
        try {
            const seekerAlreadyExist = await seekerModel.findOne({ email: email })
            console.log('seeker exist: ', seekerAlreadyExist)
            if (!seekerAlreadyExist) {
                return false
            }
            console.log('return true afte finding seekr')
            return true
        } catch (error: any) {
            console.error('Error in finding seeker at seekerRepository: ', error.message)
            return false
        }


    }

    async tempOtp(otp: string, userData: seekerDetailsRule): Promise<{ created: boolean }> {
        try {
            const expirationTime = 120

            const dataToStore = {
                otp,
                userData
            }

            await redisClient.set(userData.email as string, JSON.stringify(dataToStore), {
                EX: expirationTime
            });
            console.log('Storing OTP and employer data in redis')
            return { created: true }
        } catch (error: any) {
            console.log('Error storing OTP in redis: ', error.message)
            return { created: false }
        }
    }

    async findOtpAndSeeker(email: string, otp: string | undefined, validateOtp: boolean): Promise<{ success: boolean, userData?: seekerDetailsRule }> {
        try {
            const data = await redisClient.get(email)

            if (!data) {
                console.log('Data not exist in redis')
                return { success: false }
            }

            const { otp: storedOtp, userData } = JSON.parse(data)

            if (validateOtp) {
                if (storedOtp === otp && userData.email === email) {
                    console.log('Otp and email matched')
                    return { success: true, userData: userData }
                }
                console.log('Otp or email does not match')
                return { success: false }
            }

            if (userData.email !== email) {
                console.log('Email not matched in findOtpAndSeeker at seeker repository')
                return { success: false }
            }

            console.log("Returning use data without validating otp in findOtpAndSeeker at seeker repository")
            return { success: true, userData: userData }
        } catch (error: any) {
            console.error('Error in finding user at seeker repository: ', error.message)
            return { success: false }
        }
    }


    async createSeeker(userData: seekerDetailsRule): Promise<{ created: boolean }> {
        try {
            const hashedPassword = await hashPassword(userData.password as string)

            const newSeeker = await seekerModel.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.trim(),
                mobile: userData.mobile,
                dateOfBirth: userData.dateOfBirth,
                password: hashedPassword
            })
            console.log('User created successfully: ', newSeeker)

            if (!newSeeker) {
                return { created: false }
            }
            return { created: true }
        } catch (error: any) {
            console.error('Error in creating user at seeker repository: ', error.message)
            return { created: false }
        }
    }


    async loginSeeker(email: string, password: string): Promise<{ user?: seekerDetailsRule, success: boolean, message: string }> {
        try {
            const findUser = await seekerModel.findOne({ email: email })

            if (!findUser) {
                return { success: false, message: 'User not found, please signup' }
            }

            const isPassword = await comparePassword(password, findUser.password as string)

            if (!isPassword) {
                return { success: false, message: 'Invalid email or password' }
            }

            if (findUser.blocked) {
                return { success: false, message: 'Access denied. Your account is blocked' }
            }

            const user: seekerDetailsRule = {
                _id: findUser._id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                email: findUser.email,
                mobile: findUser.mobile,
                blocked: findUser.blocked
            }

            return { user: user, success: true, message: 'Login successful' }


        } catch (error: any) {
            console.error('Error in login seeker at seekerRespository: ', error.message)
            return { success: false, message: 'Something went wrong' }
        }
    }

    async findUserDataByEmail(email: string): Promise<{ userData?: seekerDetailsRule, success: boolean }> {
        try {
            const user = await seekerModel.findOne({ email: email })
            if (!user) {
                return { success: false }
            }
            return { userData: user, success: true }
        } catch (error: any) {
            console.error('Error in findUserDataByEmail at repository/seekerRepository: ', error)
            return { success: false }
        }
    }

    async updateField(email: string, value: string, field: string): Promise<{ success: boolean, message?: string }> {
        try {
            const updateData = { [field]: value }
            const result = await seekerModel.updateOne({ email }, { $set: updateData })

            if (result.modifiedCount === 0) {
                return { success: false, message: `No changes made` }
            }

            return { success: true, message: `${field} updated` }
        } catch (error: any) {
            console.error('Error in updatedField at repository/seekerRepository: ', error.message)
            return { success: false }
        }
    }

    async updateSeekerDataById(seekerId: string, seekerData: SeekerEditProfileRule): Promise<boolean> {
        try {
            const result = await seekerModel.updateOne({ _id: seekerId }, { $set: seekerData })
            console.log('REsult in updateSeeker: ', result)
            if (result.modifiedCount === 0) {
                return false
            }
            return true
        } catch (error: any) {
            console.error('Error in updateSeekerDataById at repository/seekerRepository: ', error.message)
            return false
        }
    }

    async getSeekerDetails(seekerId: string): Promise<{ success: boolean, seeker?: seekerDetailsRule }> {
        try {
            const result = await seekerModel.findById(seekerId).lean()
            if (!result) {
                return { success: false }
            }
            return { success: true, seeker: result }
        } catch (error: any) {
            console.error('Error in getSeekerDetails at repository/seekerRepository: ', error.message)
            return { success: false }

        }
    }

    async updateSeekerArrayFields(seekerId: string, field: string, data: string): Promise<boolean> {
        try {
            const updateSeeker = await seekerModel.findByIdAndUpdate(
                seekerId,
                { $push: { [field]: data } },
                { new: true }
            )
            if (!updateSeeker) {
                return false
            }
            return true
        } catch (error: any) {
            console.error('Error in updateSeekerArrayFields at repository/seekerRepository: ', error.message)
            return false

        }
    }

    async removeSeekerArrayValues(seekerId: string, field: string, value: string): Promise<boolean> {
        try {
            const result = await seekerModel.updateOne(
                {_id: seekerId},
                {$pull: {[field]: value}}
            )
            if(result.modifiedCount === 0){
                return false
            }
            return true
        } catch (error: any) {
            console.error('Error in removeSeekerArrayValues at repository/seekerRepository: ', error.message)
            return false
        }
    }

    async applicationCreateRepo(data: JobApplyProps): Promise<{created: boolean; message?: string, applicationId?: string}> {
        try {
            const applicationExist = await jobApplicationModel.findOne({
                seekerId: data.seekerId,
                jobId: data.jobId
            })
            if(applicationExist){
                return {created: false, message: 'conflict'}
            }
            const application = await jobApplicationModel.create(data)
            console.log('After create application: ', application)
            return {created: true, applicationId: application._id!.toString()}
        } catch (error: any) {
            console.error('Error in removeSeekerArrayValues at repository/seekerRepository: ', error.message)
            return {created: false, message: 'server error'}
        }
    }

    async updateJobWithApplicationIdRepo(jobId: string, applicationId: string): Promise<boolean> {
        try {
            const result = await jobPostModel.updateOne(
                {_id: jobId},
                {$push: {jobApplications: applicationId}}
            )

            if(result.modifiedCount === 0){
                return false
            }
            return true
        } catch (error: any) {
            console.error('Error in updateJobWithApplicationIdRepo at repository/seekerRepository: ', error.message)
            return false
        }
    }

    async googleAuthenticationSeekerRepo(email: string, firstName: string, lastName: string): Promise<{user?: seekerDetailsRule, success: boolean}> {
        try {
            let findUser = await seekerModel.findOne({email})
            if(!findUser){
                findUser = await seekerModel.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                })
            }
            const data: seekerDetailsRule = {
                _id: findUser._id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                email: findUser.email,
                blocked: findUser.blocked
            }
            
            return {success: true, user: data}
        } catch (error: any) {
            console.error('Error in googleAuthenticationSeekerRepo at repository/seekerRepository: ', error.message)
            return {success: false}
        }
    }

}




export default SeekerRepository