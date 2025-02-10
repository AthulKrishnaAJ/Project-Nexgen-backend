import jwt from 'jsonwebtoken'

export default interface IJwtSerivce {
    generateAccessToken(payload: Object, options: jwt.SignOptions): string
    generateRefreshToken(payload: Object, options: jwt.SignOptions): string
    verifyToken(token: string): {success: boolean, verifyToken?: any}
    verifyRefreshToken(token: string): {success: boolean, verifyToken?: any}
}