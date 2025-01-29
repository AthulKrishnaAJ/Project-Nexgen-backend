import { Request, Response, NextFunction } from "express"
import IAdminSeekerInterface from "../../../entities/admin/IAdminSeekerInteractor"
import httpStatus from "../../../entities/rules/httpStatusCodes"

class AdminSeekerController {
    private interactor: IAdminSeekerInterface

    constructor(interactor: IAdminSeekerInterface){
        this.interactor = interactor
    }
    getAllUserControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const response = await this.interactor.getAllUserCase()
            console.log('Success reponse in getAllUserControl at adminSeekerControl: ', response)
            return res.status(httpStatus.OK).json({userData: response.userData, status: response.success})
        } catch (error: any) {
            console.log('Error in getAllUserControl at adminSeekerControl: ', error)
            next(error)
        }
    }

    usersBlockUnblockControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {id, action} = req.body
            const response = await this.interactor.userBlockUnblockCase(id, action)
            console.log('Success reponse in usersBlockUnblockControl at adminSeekerControl: ', response)
            return res.status(httpStatus.OK).json({status: response.success, userData: response.userData})
        } catch (error: any) {
            console.error('Error in usersBlockUblockControl at adminSeekerControl: ', error.message)
            next(error)
        }
    }
}


export default AdminSeekerController