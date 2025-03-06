import { Request, Response, NextFunction } from "express" 

import ICompanySeekerInterface from "../../../entities/company/ICompanySeekerInterface"


class CompanySeekerController {
    private interactor: ICompanySeekerInterface

    constructor(interactor: ICompanySeekerInterface){
        this.interactor = interactor
    }   

    getApplicantsControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const companyId = req.params.companyId
            const response = await this.interactor.getApplicantsCase(companyId)
            return res.status(response.statusCode).json({status: true, applications: response.applications})
        } catch (error) {
            next(error)
        }
    }
}

export default CompanySeekerController