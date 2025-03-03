import fs, { appendFile } from 'fs'

import AppError from "../../frameworks/utils/errorInstance"
import httpStatus from "../../entities/rules/httpStatusCodes"

//type and interfaces
import ISeekerProfileInterfce from "../../entities/seeker/ISeekerProfileInterface"
import ISeekerRepository from "../../entities/IRepositories/iSeekerRepository"
import ICommonRepository from "../../entities/IRepositories/ICommonRepository"
import { SeekerEditProfilePayloadRule, SeekerDataForStore, SeekerFetchingDetailsRule, seekerDetailsRule } from "../../entities/rules/seekerRules"
import IAwsService from "../../entities/services/IAwsService"



class SeekerProfile implements ISeekerProfileInterfce {
    private repository: ISeekerRepository
    private commonRepository: ICommonRepository
    private awsService: IAwsService
    
    constructor(repository: ISeekerRepository, commonRepo: ICommonRepository, awsService: IAwsService){
        this.repository = repository
        this.commonRepository = commonRepo
        this.awsService = awsService
    }

    async getSeekerCase(seekerId: string): Promise<{success: boolean, statusCode: number, seeker?: seekerDetailsRule}> {
        try {
            const response = await this.repository.getSeekerDetails(seekerId)
            
            if(!response.success || !response.seeker){
                throw new AppError('Somthing went wrong', httpStatus.INTERNAL_SERVER_ERROR)
            }
            let resumeFiles: { fileKey: string, base64: string }[]  = []
            if(response.seeker?.resume && response.seeker.resume?.length > 0){
                resumeFiles = await Promise.all(
                    response.seeker.resume?.map(async (key: string) =>  {
                        const fileBuffer = await this.awsService.getFileFromS3(key)
                        if(fileBuffer){
                            return {
                                fileKey: key,
                                base64: fileBuffer.toString('base64')
                            }
                        }
                        return { fileKey: key, base64: "" };
                    })
                )
            }
            return {success: true, statusCode: httpStatus.OK, seeker: { ...response.seeker, resumeFiles }}
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

    async uploadResumeCase(seekerId: string, filePath: string, fileName: string, mimetype: string): Promise<{success: boolean; statusCode: number}>{
        try {
            const fileData = fs.readFileSync(filePath)
            const upload = await this.awsService.uploadToS3(fileData, fileName, mimetype)
            fs.unlinkSync(filePath)

            if(!upload.success){
                throw new AppError('Upload failed, please try again', httpStatus.BAD_REQUEST)
            }

            const getSeeker = await this.repository.getSeekerDetails(seekerId)

            if(getSeeker.seeker && getSeeker.seeker?.resume?.includes(upload.key!)){
                throw new AppError('Resume already exist', httpStatus.CONFLICT)
            }

            const updateDb = await this.repository.updateSeekerArrayFields(seekerId, 'resume', upload.key!)

            if(!updateDb){
                throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {success: true, statusCode: httpStatus.OK}
        } catch (error: any) {
            console.error('Error in uploadResumeCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    async addSkillCase(seekerId: string, skill: string): Promise<{message: string, statusCode: number}> {
        try {
            const getSeeker = await this.repository.getSeekerDetails(seekerId)
            if(getSeeker.seeker && getSeeker.seeker?.skills?.includes(skill)){
                throw new AppError('Skill already exist', httpStatus.CONFLICT)
            }
            const updateSkill = await this.repository.updateSeekerArrayFields(seekerId, 'skills', skill)

            if(!updateSkill){
                throw new AppError('Somthing went wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {message: 'Skill updated', statusCode: httpStatus.OK}
        } catch (error: any) {
            console.log('Erro in addSkillCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    async removeSkillCase(seekerId: string, skill: string): Promise<{ statusCode: number; }> {
        try {
            const removeSkill = await this.repository.removeSeekerArrayValues(seekerId, 'skills', skill)
            if(!removeSkill){
                throw new AppError('Somthing when wrong, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return {statusCode: httpStatus.OK}
        } catch (error: any) {
            console.log('Erro in removeSkillCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    async removeResumeCase(seekerId: string, fileName: string): Promise<{statusCode: number}> {
        try {
            const deleteFromBucket = await this.awsService.deleteFileFromS3(fileName)
            const deleteFromDb = await this.repository.removeSeekerArrayValues(seekerId, 'resume', fileName)

            if(!deleteFromBucket || !deleteFromDb){
                throw new AppError('Couldn"t remove your resume, please try again', httpStatus.INTERNAL_SERVER_ERROR)
            }
            return{statusCode: httpStatus.OK}
        } catch (error: any) {
            console.log('Erro in removeResumeCase at usecase/seekerProfile: ', error.message)
            throw error
        }
    }

    

    
}


export default SeekerProfile