import express, { Router } from 'express'
import CompanyAuthController from '../../../adapters/controllers/companyController/companyAuthController'
import CompanyAuth from '../../../usecases/company/companyAuth'
import CompanyRepository from '../../../adapters/repositories/companyRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'


const companyRouter: Router = express.Router()
const repository = new CompanyRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const companyAuth = new CompanyAuth(repository, mailer, jwtService, commonRepository)
const controller = new CompanyAuthController(companyAuth)

companyRouter.post('/signup', controller.employerSendOtpControl)
companyRouter.post('/verifyOtp', controller.employerVerifyOtpControl)
companyRouter.post('/login', controller.employerLoginControl)
companyRouter.post('/emailVerify', controller.employerForgotPasswordEmailVeifyControl)
companyRouter.post('/verifyOtpForChangePassword', controller.employerChangePasswordVerifyOtpControl)
companyRouter.post('/changePassword', controller.employerChangePasswordControl)


export default companyRouter