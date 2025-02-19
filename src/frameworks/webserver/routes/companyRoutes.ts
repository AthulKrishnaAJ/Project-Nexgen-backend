import express, { Router } from 'express'
import CompanyAuthController from '../../../adapters/controllers/companyController/companyAuthController'
import CompanyAuth from '../../../usecases/company/companyAuth'
import CompanyRepository from '../../../adapters/repositories/companyRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'
import authMiddleware from '../middlewares/roleAuthorization'

import CompanyJobCases from '../../../usecases/company/companyJobCases'
import companyJobController from '../../../adapters/controllers/companyController/companyJobController'


const companyRouter: Router = express.Router()
const repository = new CompanyRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const companyAuth = new CompanyAuth(repository, mailer, jwtService, commonRepository)
const authController = new CompanyAuthController(companyAuth)

const companyJobCases = new CompanyJobCases(repository, commonRepository)
const jobController = new companyJobController(companyJobCases)

companyRouter.post('/signup', authController.employerSendOtpControl)
companyRouter.post('/verifyOtp', authController.employerVerifyOtpControl)
companyRouter.post('/login', authController.employerLoginControl)
companyRouter.post('/emailVerify', authController.employerForgotPasswordEmailVeifyControl)
companyRouter.post('/verifyOtpForChangePassword', authController.employerChangePasswordVerifyOtpControl)
companyRouter.post('/changePassword', authController.employerChangePasswordControl)

companyRouter.post('/jobPost', authMiddleware('company', jwtService), jobController.jobPostControl)


export default companyRouter