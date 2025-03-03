import { Request, Response, NextFunction } from "express";

//interfaces 
import ISeekerProfileInterfce from "../../../entities/seeker/ISeekerProfileInterface";

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */


class seekerProfileController {
    private interactor: ISeekerProfileInterfce

    constructor(interactor: ISeekerProfileInterfce){
        this.interactor  = interactor
    }

    getSeekerControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const seekerId = req.params.seekerId
            const response = await this.interactor.getSeekerCase(seekerId)
            return res.status(response.statusCode).json({status: response.success, seekerData: response.seeker})
        } catch (error) {
            next(error)
        }
    }

    editProfileControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = req.body
            const response = await this.interactor.editProfileCase(data)
            return res.status(response.statusCode).json({status: response.success, message: response.message, seeker: response.user})
        } catch (error) {
            next(error)
        }
    }

    uploadResumeControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {path, originalname, mimetype} = req.file!
            const {seekerId} = req.body
            const response = await this.interactor.uploadResumeCase(seekerId, path, originalname, mimetype)
            return res.status(response.statusCode).json({message: 'Resume uploaded', status: response.success})
        } catch (error) {
            next(error)
        }
    }

    addSkillControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {skill, seekerId} = req.body
            const response = await this.interactor.addSkillCase(seekerId, skill)
            return res.status(response.statusCode).json({message: response.message, status: true})
        } catch (error) {
            next(error)
        }
    }

    removeSkillControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {skill, seekerId} = req.body
            const response = await this.interactor.removeSkillCase(seekerId, skill)
            return res.status(response.statusCode).json({status: true})
        } catch (error) {
            next(error)
        }
    }

    removeResumeControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {seekerId, fileName} = req.body
            const response = await this.interactor.removeResumeCase(seekerId, fileName)
            return res.status(response.statusCode).json({status: true})
        } catch (error) {
            next(error)
        }
    }

}

export default seekerProfileController