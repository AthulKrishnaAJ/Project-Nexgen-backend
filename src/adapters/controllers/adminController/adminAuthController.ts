import { Request, Response, NextFunction } from "express";

//Files
import IAdminAuthInterface from "../../../entities/admin/IAdminAuthInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";

class AdminAuthController {
    private interactor: IAdminAuthInterface

    constructor(interactor: IAdminAuthInterface){
        this.interactor = interactor
    }

    adminLoginControl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, password} = req.body
            console.log('passed data from admin controller: ', email, password)
            const response = await this.interactor.adminLoginCase(email, password)
            if(response.success){
                res.cookie('adminAccessToken', response.adminAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: '/admin'
                })

                res.cookie('adminRefreshToken', response.adminRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 15 * 60 * 1000,
                    path: '/admin'
                })
            }
            return res.status(httpStatus.OK).json({adminData: response.adminData, status: true, message: response.message})
        } catch (error: any) {
            console.error('Error in adminLoginControl at controller/adminController/adminAuthController: ', error.message)
            next(error)
        }
    }
}

export default AdminAuthController