import IAdminCompanyInterface from "../../entities/admin/IAdminCompanyInteractor";
import IAdminRepository from "../../entities/IRepositories/IAdminRepository";
import ICommonRepository from "../../entities/IRepositories/ICommonRepository";
import { CompanyDataForAdmin, companyProjectionData, CompanyVerifyData } from "../../entities/rules/adminRules";
import httpStatus from "../../entities/rules/httpStatusCodes";
import AppError from "../../frameworks/utils/errorInstance";
import { IMailerInterface } from "../../entities/services/IMailerInteractor";

class AdminCompany implements IAdminCompanyInterface {
    private repository: IAdminRepository
    private commonRepository: ICommonRepository
    private mailer: IMailerInterface

    constructor(repository: IAdminRepository, commonRepo: ICommonRepository, mailer: IMailerInterface){
        this.repository = repository
        this.commonRepository = commonRepo
        this.mailer = mailer
    }

    async getAllCompaniesCase(): Promise<{ companiesData?: CompanyDataForAdmin[]; success: boolean; }> {
        try {
            const getAllCompanies = await this.repository.getAllCompaniesRepo(companyProjectionData)
            if(!getAllCompanies.success){
                throw new AppError('Somthing wrong, cannot find companies data', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {companiesData: getAllCompanies.companiesData, success: getAllCompanies.success}
        } catch (error: any) {
            console.error('Error in getAllCompaniesCase at usecase/admin/adminCompany : ', error.message)
            throw error
        }
    }

    async companyVerificationCase(email: string, action: string, reason?: string): Promise<{companyData?: CompanyDataForAdmin, success: boolean}> {

        try {
            const findCompany = await this.commonRepository.findCompanyByEmail(email)
            if(!findCompany.success || !findCompany.companyData){
                throw new AppError('Cannot found company', httpStatus.NOT_FOUND)
            }
            const companyId = findCompany.companyData?._id?.toString()
            if(!companyId){
                throw new AppError('Somthing went wrong try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            let updatedData: CompanyVerifyData = {verify: action}
            let rejectionDays = 0
            if(action === 'reject' && reason){
                const expiryDate = new Date()
                expiryDate.setMonth(expiryDate.getMonth() + 6)

                const currentDate = new Date()
                rejectionDays =  Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)); 

                updatedData.rejection = {
                    reason,
                    expiryDate
                }
            } else {
                updatedData.rejection = {
                    reason: null,
                    expiryDate: null
                }
            }
            const updatedCompany = await this.repository.findCompanyByIdAndUpdate(companyId, updatedData, companyProjectionData)
            
            if(!updatedCompany.success){
                throw new AppError('Verification failed please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }


           const emailText = action === 'accept' 
            ? {
                subject: 'Approval mail from Nexgen',
                message: 'Your company has been verified successfully.'
            } 
            : {
                subject: 'Rejection mail from Nexgen',
                message: `Your company was rejected. Reason: ${reason}. You can re-register after ${rejectionDays} days.`
            };

            const sendMailtoClient = await this.mailer.sendMailToClients(email, emailText.subject, emailText.message)

            if(!sendMailtoClient){
                throw new AppError('Somthing went wrong, Cannot send mail to company', httpStatus.BAD_REQUEST)
            }
            return {companyData: updatedCompany.companyData, success: true}
        } catch (error: any) {
            console.error('Error in companyVerificationCase at usecase/admin/adminCompany : ', error.message)
            throw error
            
        }
    }

}

export default AdminCompany