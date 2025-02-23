import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"

//type and interfaces
import ISeekerProfileInterfce from "../../entities/seeker/ISeekerProfileInterface"
import ISeekerRepository from "../../entities/IRepositories/iSeekerRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { SeekerEditProfilePayloadRule, SeekerDataForStore, SeekerFetchingDetailsRule, seekerDetailsRule } from "../../entities/rules/seekerRules"



class SeekerProfile implements ISeekerProfileInterfce {
    private repository: ISeekerRepository
    private commonRepository: ICommonRepository
    
    constructor(repository: ISeekerRepository, commonRepo: ICommonRepository){
        this.repository = repository
        this.commonRepository = commonRepo
    }

    async getSeekerCase(seekerId: string): Promise<{success: boolean, statusCode: number, seeker?: seekerDetailsRule}> {
        try {
            const response = await this.repository.getSeekerDetails(seekerId)
            if(!response.success){
                throw new AppError('Somthing went wrong', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: true, statusCode: httpStatus.OK, seeker: response.seeker}
        } catch (error: any) {
            console.error('Error in getSeekerCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    async editProfileCase(data: SeekerEditProfilePayloadRule): Promise<{success:boolean, message: string, statusCode: number, user: SeekerDataForStore}> {
        try {
            const {seekerId, seekerData} = data
            console.log('Seeker data in usecase: ', seekerData)
            
            const response = await this.repository.updateSeekerDataById(seekerId, seekerData)
            if(!response){
                throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            const user: SeekerDataForStore = {
                _id: seekerId,
                firstName: seekerData.firstName,
                lastName: seekerData.lastName,
                mobile: seekerData.mobile
            }
            return {success: true, message: 'Details updated', statusCode: httpStatus.OK, user: user}
        } catch (error: any) {
            console.error('Error in editProfileCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    
}


export default SeekerProfile