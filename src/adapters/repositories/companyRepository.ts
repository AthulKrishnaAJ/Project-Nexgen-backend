import ICompanyRepository from "../../entities/IRepositories/ICompanyRepository";
import companyModel from "../../frameworks/database/mongoDB/models/employerSchema";
import jobPostModel from "../../frameworks/database/mongoDB/models/jobPostSchema";
import redisClient from "../../frameworks/database/redis/redisConnection";
import { EmployerDetailsRule, JobPostDataState, JobPostRule , changeJobStatusProps} from "../../entities/rules/companyRules";
import { hashPassword, comparePassword } from "../../frameworks/services/passwordService";

class CompanyRepository implements ICompanyRepository {

    async companyExists(email: string): Promise<{success: boolean, companyData?: EmployerDetailsRule}>{
        try {
            const employerAlreadyExist = await companyModel.findOne({email: email})
            console.log('employer exist: ', employerAlreadyExist)
            if(!employerAlreadyExist){
                console.log('enter in false condition')
                return {success: false}
            }
            console.log('return true afte finding seekr')
            return {success: true, companyData: employerAlreadyExist}
        } catch (error: any) {
            console.error('Error in finding seeker at employerRepository: ', error.message)
            return {success: false}
        }
    }

    async tempOtp(otp: string, employerData: EmployerDetailsRule):Promise<{ created: boolean }> {
        try{
            const expirationTime = 120
            
            const dataToStore = {
                otp,
                employerData
            }

            await redisClient.set(employerData.email, JSON.stringify(dataToStore), {
                EX: expirationTime
            });
            console.log('Storing OTP and user data in redis')
            return {created: true}
        }catch(error: any){
            console.log('Error storing OTP in redis: ', error.message)
            return {created: false}
        }
    }

    async findOtpAndCompany(email: string, otp: string | undefined, validateOtp: boolean): Promise<{success: boolean, userData?: EmployerDetailsRule}> {
        try {
            const data = await redisClient.get(email)
            
            if(!data){
                console.log('Data not exist in redis')
                return {success: false}
            }
      
            const {otp: storedOtp, employerData} = JSON.parse(data)

            if(validateOtp){
                if(storedOtp === otp && employerData.email === email){
                    console.log('Otp and email matched')
                    return {success: true, userData: employerData}
                }
                console.log('Otp or email does not match')
                return {success: false}
            }

            if(employerData.email !== email){
                console.log('Email not matched in findOtpAndSeeker at seeker repository')
                return {success: false}
            }

            console.log("Returning user data without validating otp in findOtpAndSeeker at seeker repository")
            return {success: true, userData: employerData}
        } catch (error: any) {
            console.error('Error in finding user at seeker repository: ', error.message)
            return {success: false}
        }
    }

    async createCompany(companyData: EmployerDetailsRule): Promise<{created: boolean}> {
        try{
            const hashedPassword = await hashPassword(companyData.password as string)
       
            const newSeeker = await companyModel.create({
                companyName: companyData.companyName,
                industry: companyData.industry,
                email: companyData.email,
                mobile: companyData.mobile,
                foundedAt: companyData.foundedAt,
                state: companyData.state,
                district: companyData.district,
                password: hashedPassword
            })
            
            if(!newSeeker){
                return {created: false}
            }
            console.log('User created successfully: ', newSeeker)
            return {created: true}
        }catch(error: any){
            console.error('Error in creating user at seeker repository: ', error.message)
            return {created: false}
        }
    }

    async companyLoginRepo(email: string, password: string): Promise<{ userData?: EmployerDetailsRule; success: boolean; message: string; }> {
        try {
            const findEmployer = await companyModel.findOne({email: email})
            if(!findEmployer){
                return {success: false, message: 'Incorrect email'}
            }

            const isPassword = await comparePassword(password, findEmployer.password as string)
            if(!isPassword){
                return {success: false, message: 'Incorrect password'}
            }

            if(findEmployer?.verify === 'reject' && findEmployer?.rejection?.expiryDate){
                let endDate = new Date(findEmployer.rejection.expiryDate)
                let currentDate = new Date()
                // currentDate.setDate(currentDate.getDate() + 7)
                if(currentDate < endDate){
                    let remainingDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
                    return {success: false, message: `Company has been rejected, Signup after ${remainingDays} days`}
                } 
                return {success: false, message: 'Rejection period has been ended, Please signup'}
            }

            if(findEmployer.blocked){
                return {success: false, message: 'Access denied. Your account is blocked'}
            }

            const user: EmployerDetailsRule = {
                _id: findEmployer._id,
                companyName: findEmployer.companyName,
                industry: findEmployer.industry,
                email: findEmployer.email,
                mobile: findEmployer.mobile,
                blocked: findEmployer.blocked,
                verify: findEmployer.verify
            }
            return {userData: user, success: true, message: 'Login successful'}
        } catch (error: any) {
            console.error('Error in companyLoginRepo at company repository: ', error.message)
            throw new Error('Somthing went wrong')
        }
    }


    async companyUpdateFieldByEmailRepo(email: string, value: string, field: string): Promise<{ success: boolean; message?: string; }> {
        try {
            const updateData = {[field]: value}
            const updateField = await companyModel.updateOne({email}, {$set: updateData})

            if(updateField.modifiedCount === 0){
                return {success: false}
            }
            return {success: true, message: `${field} updated`}
        } catch (error: any) {
            console.error('Error in employerUpdateFieldRepo at repository/companyRepository: ', error.message)
            return {success: false}
        }
    }


    async companyUpdateFieldByIdRepo(id: string, updateData: any): Promise<{success: boolean}> {
        try {
            const updateField = await companyModel.findByIdAndUpdate(
                id,
                updateData,
                {new: true}
            )
            if(!updateField){
                return {success: false}
            }
            return {success: true}
        } catch (error: any) {
            console.error('Error in companyUpdateFieldByIdRepo at repositories/companyRepository: ', error.message)
            return {success: false}
        }

    }


    async companyJobPostRepo(jobData: JobPostDataState): Promise<boolean> {
        try {
            console.log('Data in company job post repooooooooooo: ', jobData)
            if(!jobData){
                return false
            }

            const newJob = await jobPostModel.create({
                title: jobData.title,
                description: jobData.description,
                state: jobData.state,
                district: jobData.district,
                employmentType: jobData.employmentType,
                workMode: jobData.workMode,
                salaryRange: {
                    min: jobData.minSalary,
                    max: jobData.maxSalary
                },
                experience: {
                    min: jobData.minExperience,
                    max: jobData.maxExperience
                },
                skills: jobData.skills,
                requirements: jobData.requirements,
                benefits: jobData.benefits,
                companyId: jobData.companyId
            })
            if(!newJob){
                return false
            }
            console.log('Job created: ', newJob)
            return true
        } catch (error: any) {
            console.error('Error in companyJobPostRepo at repository/companyRepository: ', error.message)
            return false
        }
    }

    async  getAllJobsRepo(companyId: string): Promise<{success: boolean, jobs?: JobPostRule[]}> {
        try {
            const jobs = await jobPostModel.find({companyId: companyId})
            if(!jobs){
                return {success: false}
            }
            return {success: true, jobs: jobs}
        } catch (error: any) {
            console.error('Error in getAllJobsRepo at repository/companyRepository: ', error.message)
            return {success: false}
        }
    }

    async updateJobsFieldRepo(data: changeJobStatusProps): Promise<boolean> {
        try {
            const {jobId} = data
            const updateField = await jobPostModel.updateOne({_id: jobId}, {$set: data})
            if(updateField.modifiedCount === 0){
                return false
            }
            return true
        } catch (error: any) {
            console.error('Error in updateJobsFieldRepo at repository/companyRepository: ', error.message)
            return false
            
        }
    }


}

export default CompanyRepository