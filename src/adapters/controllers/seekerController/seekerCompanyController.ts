import { Request, Response, NextFunction } from "express";

//interfaces
import ISeekerCompanyInterface from "../../../entities/seeker/ISeekerCompanyInterface";


/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */

class seekerCompanyController {
    private interactor: ISeekerCompanyInterface

    constructor(interactor: ISeekerCompanyInterface) {
        this.interactor = interactor
    }

    getAllCompanyControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const response = await this.interactor.getAllCompaniesCase()
            return res.status(response.statusCode).json({companies: response.companies, status: true})
        } catch (error) {
            next(error)
        }
    }
}

export default seekerCompanyController