
import IcommonRepository from "../../entities/IRepositories/ICommonRepository";
import { UserDataForAdmin, CompanyDataForAdmin } from "../../entities/rules/adminRules";
import { JobPostRule, GetCompanyDetialsState, EmployerDetailsRule } from "../../entities/rules/companyRules";
import redisClient from "../../frameworks/database/redis/redisConnection";
import seekerModel from "../../frameworks/database/mongoDB/models/seekerSchema";
import companyModel from "../../frameworks/database/mongoDB/models/employerSchema";
import jobPostModel from "../../frameworks/database/mongoDB/models/jobPostSchema";
import { findCompanyProjection } from "../../entities/rules/projections";
import { CompanyDetailsState } from "../../entities/rules/commonRules";


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

    async findUserById(id: string): Promise<{ userData?: UserDataForAdmin; success: boolean; }> {
        try{
            const user = await seekerModel.findById(id)
            if(!user){
                return {success: false}
            }
            return {userData: user, success: true}
        }catch(error: any){
            console.error('Error in findUserById at repository/commonRepository: ', error.message)
            return {success: false}
        }
    }

    async findCompanyByEmail(email: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}> {
        try {
            const company = await companyModel.findOne({email: email})
            if(!company){
                return {success: false}
            }
            return {companyData: company, success: true}
        } catch (error: any) {
            console.error('Error in findCompanyByEmail at repository/commonRepository: ', error.message)
            return {success: false}
            
        }
    }

    async getAllJobsRepo():Promise<{success: boolean, jobs?:JobPostRule[]}>{
        try {
            const getJobs = await jobPostModel.find({ status: "open" }).lean()
            if(!getJobs){
                return {success: false}
            }
            return {success: true, jobs: getJobs}
        } catch (error: any) {
            console.error('Error in getAllJobsRepo at repository/commonRepository: ', error.message)
            return {success: false}
        }
    }


    async getCompaniesById(companyIds: string[]): Promise<{success: boolean; companyDatas?: GetCompanyDetialsState[]}> {
        try {
            const companies = await companyModel.find(
                {_id: {$in: companyIds}},
                findCompanyProjection
            ).lean()

            return {success: true, companyDatas: companies as GetCompanyDetialsState[]}
        } catch (error: any) {
            console.error('Error in getCompanyByCompanyId at repository/commonRepository: ', error.message)
            return {success: false}
        }
    }


    async getAllCompaniesRepo(): Promise<{ success: boolean; company?: EmployerDetailsRule[]}> {
        try {
            const companies = await companyModel.find(
                {blocked: false, verify: {$ne: 'reject'}}, 
                {password: 0}).lean()

            return {success: true, company: companies}
        } catch (error: any) {
            console.error('Error in getAllCompaniesRepo at commonRepository')
            return {success: false}
        }
    }

    async getCompanyByIdRepo(companyId: string): Promise<{success: boolean, company?: EmployerDetailsRule | null}> {
        try {
            const companyDetail = await companyModel.findById(companyId, {password: 0})
            return {success: true, company: companyDetail}
        } catch (error) {
            console.error('Error in getCompanyByIdRepo at commonRepository')
            return {success: false}
        }
    }   


}


export default CommonRepository