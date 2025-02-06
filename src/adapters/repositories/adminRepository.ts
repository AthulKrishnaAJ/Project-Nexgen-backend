
import IAdminRepository from "../../entities/IRepositories/IAdminRepository";
import { UserDataForAdmin, CompanyDataForAdmin } from "../../entities/rules/adminRules";
import seekerModel from "../../frameworks/database/mongoDB/models/seekerSchema";
import companyModel from "../../frameworks/database/mongoDB/models/employerSchema";

const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD



class AdminRepository implements IAdminRepository {

    async adminValidEmailAndPasswordRepo(email: string, password: string): Promise<boolean> {
        try {
            if(adminEmail !== email || adminPassword !== password){
                return false
            }
            return true
        }catch(error: any){
            console.error('Error in ValidEmailAndPassword at repositoris/adminRepository: ', error.message)
            return false
        }
    }

    async getAllUsersRepo(projection: Record<string, number>): Promise<{ userData?: UserDataForAdmin[]; success: boolean; }> {
        try {
            const allUsers = await seekerModel.find({}, projection).lean()

            if(!allUsers || allUsers.length === 0){
                return {success: false}
            }
            return {userData: allUsers, success: true}
        } catch (error: any) {
            console.log('Error in getAllUsersRepo at repository/adminRepository: ', error.message)
            return {success: false}

        }
    }

    async findUserAndUpdate(id: string, field: string, value: any, projection?: Record<string, number>): Promise<{ userData?: UserDataForAdmin; success: boolean; }> {
        try {
            const updatedField = {[field]: value}
            const updateUser = await seekerModel.findByIdAndUpdate(
                id,
                updatedField,
                {new: true, projection}
            )
            if(!updateUser){
                return {success: false}
            }
            return {userData: updateUser, success: true}
        } catch (error: any) {
            console.error('Error in findUserAndUpdate at repository/adminRepository: ', error.message)
            return {success: false}
        }
    }

    async getAllCompaniesRepo(projection: Record<string, number>): Promise<{ companiesData?: CompanyDataForAdmin[]; success: boolean; }> {
        try {
            const allCompanies = await companyModel.find({}, projection).sort({createdAt: -1}).lean()
            if(!allCompanies || allCompanies.length === 0){
                return {success: false}
            }
            return {companiesData: allCompanies, success: true}
        } catch (error: any) {
            console.error('Error in getAllCompaniesRepo at repository/adminRepository: ', error.message)
            return {success: false}
            
        }
    }
    async findCompanyByIdAndUpdate(id: string, updatedData: any, projection: Record<string, number>): Promise<{companyData?: CompanyDataForAdmin; success: boolean}> {
        try {
            const updatedCompany = await companyModel.findByIdAndUpdate(
                id,
                updatedData,
                {new: true, projection}
            )
            if(!updatedCompany){
                return {success: false}
            }
            return {companyData: updatedCompany, success: true}
        } catch (error: any) {
            console.error('Error in findCompanyAndUpdate at repository/adminRepository: ', error.message)
            return {success: false}
            
        }
    }
}

export default AdminRepository