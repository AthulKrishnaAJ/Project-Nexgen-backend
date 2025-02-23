import { Request, Response, NextFunction } from "express";

import ICompanyJobInterface from "../../../entities/company/ICompanyJobInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";


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
        } catch (error: any) {
            console.error('Error in jobPostControl at companyController: ', error.message)
            next(error)
        }
    }


    getAllJobsControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {companyId}  = req.params
            const response = await this.interactor.getAllJobsCase(companyId)
            return res.status(response.statusCode).json({status: response.success, jobs: response.jobs})
        } catch (error: any) {
            console.error('Error in getAllJobsControl at companyController: ', error.message)
            next(error)
        }
    }

    changejobStatusControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = req.body
            console.log('daaa', data)
            const response = await this.interactor.changeJobStatusCase(data)
            return res.status(response.statusCode).json({status: response.success, message: response.message})
        } catch (error: any) {
            console.error('Error in changejobStatusControl at companyController: ', error.message)
            next(error)
        }
    }


}

export default companyJobController