import IAdminAuthInterface from "../../entities/admin/IAdminAuthInteractor";
import IAdminRepository from "../../entities/IRepositories/IAdminRepository";
import httpStatus from "../../entities/rules/httpStatusCodes";
import AppError from "../../frameworks/utils/errorInstance";
import IJwtSerivce from "../../entities/services/IJwtService";

class AdminAuth implements IAdminAuthInterface{
    private repository: IAdminRepository
    private jwtService: IJwtSerivce
    constructor(adminRepository: IAdminRepository, jwt: IJwtSerivce){
        this.repository = adminRepository
        this.jwtService = jwt
    }

    async adminLoginCase(email: string, password: string): Promise<{adminData?: string, success: boolean, message: string, adminAccessToken?: string, adminRefreshToken?: string}> {
        try{
            const isValidAdmin = await this.repository.adminValidEmailAndPasswordRepo(email, password)
            if(!isValidAdmin){
                throw new AppError('Invalid email or password', httpStatus.BAD_REQUEST)
            }
            const accessToken = this.jwtService.generateAccessToken({email: email, role: 'admin'}, {expiresIn: '1hr'})
            const refreshToken = this.jwtService.generateRefreshToken({email: email, role: 'admin'}, {expiresIn: '1d'})
            return {
                adminData: email, success: true, message: 'Login successful',
                adminAccessToken: accessToken, adminRefreshToken: refreshToken
            }
        }catch(error: any){
            console.error('Error in adminLoginCase at usecase/adminAuth: ', error.message)
            throw error
        }
    }
}


export default AdminAuth