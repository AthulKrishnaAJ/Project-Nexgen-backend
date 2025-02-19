import { Request, Response, NextFunction } from "express";

import ICompanyJobInterface from "../../../entities/company/ICompanyJobInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";


class companyJobController {
    private interactor: ICompanyJobInterface

    constructor(interactor: ICompanyJobInterface) {
        this.interactor = interactor
    }

    jobPostControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try{
            const jobData = req.body
            const response = await this.interactor.jobPostCase(jobData)
            return res.status(httpStatus.OK).json({status: response.success, message: response.message})
        }catch(error: any){
            console.log('Error in jobPostControl at companyController: ', error.message)
            next(error)
        }
    }


}

export default companyJobController