import IAdminSeekerInterface from "../../entities/admin/IAdminSeekerInteractor";
import IAdminRepository from "../../entities/IRepositories/IAdminRepository";
import ICommonRepository from "../../entities/IRepositories/ICommonRepository";
import { UserDataForAdmin, userProjectionData } from "../../entities/rules/adminRules";
import httpStatus from "../../entities/rules/httpStatusCodes";
import AppError from "../../frameworks/utils/errorInstance";


class AdminSeeker implements IAdminSeekerInterface {
    private repository: IAdminRepository
    private commonRepository: ICommonRepository

    constructor(repository: IAdminRepository, commonRepo: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepo
    }

    async getAllUserCase(): Promise<{ userData?: UserDataForAdmin[]; success: boolean; }> {
        try{
            const getAllUsers = await this.repository.getAllUsersRepo(userProjectionData)
            if(!getAllUsers.success){
                throw new AppError('Somthing went wrong, cannot find the users data', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {userData: getAllUsers.userData, success: getAllUsers.success}
        }catch(error: any) {
            console.log('Error in getAllUserCase at usecase/admin/adminSeeker: ', error.message)
            throw error
        }
    }

    async userBlockUnblockCase(seekerId: string, action: string): Promise<{userData?: UserDataForAdmin, success: boolean}> {
        try {
            let value = action === 'Block' 
            const updateAndGetUser = await this.repository.findUserAndUpdate(seekerId, 'blocked', value, userProjectionData)

            if(!updateAndGetUser.success){
                throw new AppError(`Somthing went wrong, cannot ${action} the user`, httpStatus.INTERNAL_SERVER_ERROR)
            }
            return{userData: updateAndGetUser.userData, success: updateAndGetUser.success}
        } catch (error: any) {
            console.error('Error in userBlockUnblockCase at usecase/admin/adminseeker: ', error.message)
            throw error
        }
    }
}

export default AdminSeeker