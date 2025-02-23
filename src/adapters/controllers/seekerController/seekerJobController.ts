import { Request, Response, NextFunction } from "express";

//interfaces 
import ISeekerJobInterface from "../../../entities/seeker/ISeekerJobInterface"

class SeekerJobController {
    private interactor: ISeekerJobInterface

    constructor(interactor: ISeekerJobInterface){
        this.interactor = interactor
    }

    getAllJobsControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const response = await this.interactor.getAllJobCase()
            return res.status(response.statusCode).json({status: true, jobs: response.jobs})
        } catch (error: any) {
            console.error('Error in getAllJobsControl  at seekerProfileController: ', error.message)
            next(error)
        }
    }
}

export default SeekerJobController