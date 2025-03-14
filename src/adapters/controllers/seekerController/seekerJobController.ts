import { Request, Response, NextFunction } from "express";

//interfaces 
import ISeekerJobInterface from "../../../entities/seeker/ISeekerJobInterface"


/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */

class SeekerJobController {
    private interactor: ISeekerJobInterface

    constructor(interactor: ISeekerJobInterface){
        this.interactor = interactor
    }

    getAllJobsControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const response = await this.interactor.getAllJobCase()
            return res.status(response.statusCode).json({status: true, jobs: response.jobs})
        } catch (error) {
            next(error)
        }
    }

    applyJobControl = async (req: Request, res: Response, next: NextFunction): Promise<any>=> {
        try {
            const response = await this.interactor.applyJobCase(req.body)
            return res.status(response.statusCode).json({status: true, message: response.message})
        } catch (error) {
            next(error)
        }
    }

    searchJobControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const searchTerm = req.query.searchTerm as string || "";
            const searchType = req.query.searchType as string || "";
            const response = await this.interactor.searchJobCase(searchTerm, searchType)
            return res.status(response.statusCode).json({status: true, jobs: response.jobs})
        } catch (error) {
            next(error)

        }
    }
}

export default SeekerJobController