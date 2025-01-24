import bcrypt from 'bcrypt'
import AppError from '../utils/errorInstance';
import httpStatus from '../../entities/rules/httpStatusCodes';

export const hashPassword =  async (password: string): Promise<string> => {
    try {
        let saltRoundes = 10
        const salt = await bcrypt.genSalt(saltRoundes);
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword   
    } catch (error: any) {
        console.error('Error in hasing passwor at password service file at service: ', error.message)
        throw new AppError('Somthing went wrong', httpStatus.INTERNAL_SERVER_ERROR)
    }
}



export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try{
        const isPassword = await bcrypt.compare(password, hashedPassword)
        if(!isPassword){
            return false
        }
        return true
    }catch(error: any){
        console.error('Error in comparing password at password services: ', error.message)
        throw new AppError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR)
    }
}