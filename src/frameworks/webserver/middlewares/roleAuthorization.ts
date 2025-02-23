import { Response, NextFunction } from "express";
import httpStatus from "../../../entities/rules/httpStatusCodes";
import IJwtSerivce from "../../../entities/services/IJwtService";
import companyModel from "../../database/mongoDB/models/employerSchema";
import seekerModel from "../../database/mongoDB/models/seekerSchema";
import { AuthenticatedRequest } from "../../../entities/types/express";


const authMiddleware = (allowedRole: string, jwtService: IJwtSerivce) => {

    return  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {

        try {

                
            let accessToken = req.headers.authorization?.split(' ')[1]
            const refreshToken = req.cookies?.refreshToken
   
            console.log('Access token in authMiddleware:=======> ', accessToken, '\n')
            console.log('REFRESH TOKEN in auth middleware token from cookie:===> ', refreshToken)

            if (!accessToken) {
                return res.status(httpStatus.UNAUTHORIZED).json({message: 'Token is missing'})
            }

            let decode = jwtService.verifyToken(accessToken)
          

            if(!decode.success || !decode.verifyToken){
       
                if(!refreshToken){
                    return res.status(httpStatus.UNAUTHORIZED).json({message: 'Cannot find refresh token, please login'})
                }

                const refreshDecode = jwtService.verifyRefreshToken(refreshToken)
                
                if(!refreshDecode.success || !refreshDecode.verifyToken){
                    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Session expired, please login" });
                }

                const {id, email, role} = refreshDecode.verifyToken
                const tokenPayload: Record<string, any> = {email, role}
                if(id) tokenPayload.id = id

                accessToken = jwtService.generateAccessToken(tokenPayload, {expiresIn: '1hr'})
                console.log('New access token in auth middleware: ', accessToken)
                res.setHeader('Access-Control-Expose-Headers', 'Authorization');
                res.setHeader('Authorization', `Bearer ${accessToken}`);
                decode = jwtService.verifyToken(accessToken);
                
            }


            const userRole = decode.verifyToken?.role
            const userId = decode.verifyToken?.id

            if(allowedRole !== userRole){
                return res.status(httpStatus.FORBIDDEN).json({message: 'Permission denied'})
            }


            if(userRole === 'user' && userId){
                console.log('ITS USER')
                const seeker = await seekerModel.findById(userId)
                if(!seeker) return res.status(httpStatus.UNAUTHORIZED).json({message: 'User not found'})
                if(seeker.blocked) return res.status(httpStatus.UNAUTHORIZED).json({message: 'Access denied. Account is blocked'})
            }

            
            if(userRole === 'company' && userId){
                console.log('ITS COMPANY')
                const company = await companyModel.findById(userId)
                if(!company) return res.status(httpStatus.UNAUTHORIZED).json({message: 'Company not found'})
                if(company.blocked) return res.status(httpStatus.UNAUTHORIZED).json({message: 'Access denied. Account is blocked'})
                if(company.verify !== 'accept') return res.status(httpStatus.UNAUTHORIZED).json({message: 'Company verification is pending'})
            }

            req.user = decode.verifyToken
            next()
        } catch (error: any) {
            return res.status(httpStatus.UNAUTHORIZED).json({message: 'Token verification failed'})
        }
    }
}


export default authMiddleware