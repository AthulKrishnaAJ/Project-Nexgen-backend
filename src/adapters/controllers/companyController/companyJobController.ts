import { Request, Response, NextFunction } from "express";

import ICompanyJobInterface from "../../../entities/company/ICompanyJobInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */

class companyJobController {
    private interactor: ICompanyJobInterface

    constructor(interactor: ICompanyJobInterface) {
        this.interactor = interactor
    }

    jobPostControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const jobData = req.body
            const response = await this.interactor.jobPostCase(jobData)
            return res.status(httpStatus.OK).json({ status: response.success, message: response.message })
        } catch (error) {
            next(error)
        }
    }


    getAllJobsControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {companyId} = req.params
            const response = await this.interactor.getAllJobsCase(companyId)
            return res.status(response.statusCode).json({status: response.success, jobs: response.jobs})
        } catch (error) {
            next(error)
        }
    }

    changejobStatusControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = req.body
            console.log('daaa', data)
            const response = await this.interactor.changeJobStatusCase(data)
            return res.status(response.statusCode).json({status: response.success, message: response.message})
        } catch (error) {
            next(error)
        }
    }


    editJobControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
           const data = req.body
           console.log('dataaaaaa',data)
           const response = await this.interactor.editJobCase(data)
           return res.status(response.statusCode).json({status: true, message: response.message})
        } catch (error) {
            next(error)
        }
    }


}

export default companyJobController