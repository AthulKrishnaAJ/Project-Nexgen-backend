import jwt from 'jsonwebtoken'
import  IJwtSerivce  from '../../entities/services/IJwtService'


class JwtService implements IJwtSerivce {
    private accessKey: string
    private refresKey: string
    constructor(){
        this.accessKey = process.env.ACCESS_TOKEN_KEY as string
        this.refresKey = process.env.REFRESH_TOKEN_KEY as string
    }
     generateAccessToken(payload: Object, options?: jwt.SignOptions): string {
        console.log('access: ',this.accessKey)
        const accessToken =  jwt.sign(payload, this.accessKey, options)
        return accessToken
    }

    generateRefreshToken(payload: Object, options: jwt.SignOptions): string {
        console.log('refresh key: ', this.refresKey)
        const refreshToken = jwt.sign(payload, this.refresKey, options)
        return refreshToken
    }
}

export default JwtService