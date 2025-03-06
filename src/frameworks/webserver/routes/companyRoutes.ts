import express, { Router } from 'express'

import CompanyRepository from '../../../adapters/repositories/companyRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'
import authMiddleware from '../middlewares/roleAuthorization'

//Auth based files
import CompanyAuth from '../../../usecases/company/companyAuth'
import CompanyAuthController from '../../../adapters/controllers/companyController/companyAuthController'

//Job based files
import CompanyJobCases from '../../../usecases/company/companyJobCases'
import companyJobController from '../../../adapters/controllers/companyController/companyJobController'

//Profile based files
import CompannyProfileCases from '../../../usecases/company/companyProfileCases'
import CompanyProfileController from '../../../adapters/controllers/companyController/companyProfileController'

//Seeker based files
import CompanySeekerCases from '../../../usecases/company/companySeekerCases'
import CompanySeekerController from '../../../adapters/controllers/companyController/companySeekerController'



const companyRouter: Router = express.Router()

const repository = new CompanyRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()



const companyAuth = new CompanyAuth(repository, mailer, jwtService, commonRepository)
const authController = new CompanyAuthController(companyAuth)

const companyJobCases = new CompanyJobCases(repository, commonRepository)
const jobController = new companyJobController(companyJobCases)

const companyProfileCases = new CompannyProfileCases(repository, commonRepository)
const companyController = new CompanyProfileController(companyProfileCases)

const companySeekerCases = new CompanySeekerCases(repository, commonRepository)
const seekerController = new CompanySeekerController(companySeekerCases)


//Auth based routes
companyRouter.post('/signup', authController.employerSendOtpControl)
companyRouter.post('/verifyOtp', authController.employerVerifyOtpControl)
companyRouter.post('/login', authController.employerLoginControl)
companyRouter.post('/emailVerify', authController.employerForgotPasswordEmailVeifyControl)
companyRouter.post('/verifyOtpForChangePassword', authController.employerChangePasswordVerifyOtpControl)
companyRouter.post('/changePassword', authController.employerChangePasswordControl)

//Job based routes
companyRouter.post('/jobPost', authMiddleware('company'), jobController.jobPostControl)
companyRouter.get('/getJobs/:companyId', authMiddleware('company'), jobController.getAllJobsControl)
companyRouter.post('/changeJobStatus', authMiddleware('company'), jobController.changejobStatusControl)
companyRouter.post('/editJob', authMiddleware('company'), jobController.editJobControl)

//Profile based routes
companyRouter.get('/getCompany/:companyId', authMiddleware('company'), companyController.getCompanyControl)

//Seeker based routes
companyRouter.get('/getApplicants/:companyId', authMiddleware('company'), seekerController.getApplicantsControl)

export default companyRouter