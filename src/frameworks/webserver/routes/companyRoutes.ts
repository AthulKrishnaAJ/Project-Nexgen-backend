import express, { Router } from 'express'
import CompanyAuthController from '../../../adapters/controllers/companyController/companyAuthController'
import CompanyAuth from '../../../usecases/company/companyAuth'
import CompanyRepository from '../../../adapters/repositories/companyRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'


const companyRouter: Router = express.Router()
const repository = new CompanyRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const companyAuth = new CompanyAuth(repository, mailer, jwtService)
const controller = new CompanyAuthController(companyAuth)

companyRouter.post('/signup', controller.employerSendOtpControl)
companyRouter.post('/verifyOtp', controller.employerVerifyOtpControl)
companyRouter.post('/login', controller.employerLoginControl)


export default companyRouter