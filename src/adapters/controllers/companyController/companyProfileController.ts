import { Request, Response, NextFunction } from "express";

import ICompanyProfileInterface from "../../../entities/company/ICompanyProfileInterface";

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */



class companyProfileController {
    private interactor: ICompanyProfileInterface

    constructor(interactor: ICompanyProfileInterface){
        this.interactor = interactor
    }

    getCompanyControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const companyId = req.params.companyId
            const response = await this.interactor.getCompnayCase(companyId)
            return res.status(response.statusCode).json({companyData: response.companyData})
        } catch (error: any) {
            next(error)
        }
    }
}

export default companyProfileController