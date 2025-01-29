
import { Request, Response, NextFunction } from "express"
import IAdminCompanyInterface from "../../../entities/admin/IAdminCompanyInteractor"
import httpStatus from "../../../entities/rules/httpStatusCodes"


class AdminCompanyController {
    private interactor: IAdminCompanyInterface

    constructor(interactor: IAdminCompanyInterface){
        this.interactor = interactor
    }

    getAllCompaniesControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const response = await this.interactor.getAllCompaniesCase();
            return res.status(httpStatus.OK).json({companiesData: response.companiesData, status: response.success})
        } catch (error: any) {
            console.error('Error in getAllCompaniesControl at adminCompanyController: ', error.message)
            next(error)
        }
    }

    comapnyVerificationControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, action, reason} = req.body
            const response = await this.interactor.companyVerificationCase(email, action, reason)
            return res.status(httpStatus.OK).json({companyData: response.companyData, status: response.success})
        } catch (error: any) {
            console.error('Error in comapnyVerificationControl at adminCompanyController: ', error.message)
            next(error)
            
        }
    }
}


export default AdminCompanyController