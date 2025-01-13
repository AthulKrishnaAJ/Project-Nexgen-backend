import jwt from 'jsonwebtoken'

export default interface IJwtSerivce {
    generateAccessToken(payload: Object, options: jwt.SignOptions): string
    generateRefreshToken(payload: Object, options: jwt.SignOptions): string
}