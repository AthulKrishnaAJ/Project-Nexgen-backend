import { Request, Response, NextFunction } from "express"
import AppError from "../../utils/errorInstance"


const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {

    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'

    console.log('Error code and message: ', statusCode, message)

    res.status(statusCode).json({status: false, message: message})
}

export default errorHandler