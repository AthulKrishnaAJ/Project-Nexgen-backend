import { Request, Response, NextFunction } from "express";

//types and interfaces 
import ISeekerProfileInterfce from "../../../entities/seeker/ISeekerProfileInterface";


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
        } catch (error: any) {
            console.error('Error in getSeekerControl  at seekerProfileController: ', error.message)
            next(error)
        }
    }

    editProfileControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = req.body
            const response = await this.interactor.editProfileCase(data)
            return res.status(response.statusCode).json({status: response.success, message: response.message, seeker: response.user})
        } catch (error: any) {
            console.error('Error in editProfileControl  at seekerProfileController: ', error.message)
            next(error)
        }
    }

}

export default seekerProfileController