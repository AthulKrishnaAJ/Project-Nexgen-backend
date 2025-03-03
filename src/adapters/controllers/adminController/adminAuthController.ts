import { Request, Response, NextFunction } from "express";

//Files
import IAdminAuthInterface from "../../../entities/admin/IAdminAuthInteractor";
import httpStatus from "../../../entities/rules/httpStatusCodes";

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<any>}
 */

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

            res.cookie('refreshToken', response.adminRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })

            return res.status(httpStatus.OK).json({
                adminData: response.adminData,
                status: true,
                message: response.message,
            })

        } catch (error: any) {
            console.error('Error in adminLoginControl at controller/adminController/adminAuthController: ', error.message)
            next(error)
        }
    }
}

export default AdminAuthController