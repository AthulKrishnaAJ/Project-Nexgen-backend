import express, { Router } from 'express'
import AdminAuthController from '../../../adapters/controllers/adminController/adminAuthController'
import AdminAuth from '../../../usecases/admin/adminAuth'
import AdminRepository from '../../../adapters/repositories/adminRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import JwtService from '../../services/jwt'
import Mailer from '../../services/mailer'
import authMiddleware from '../middlewares/roleAuthorization'


import AdminSeekerController from '../../../adapters/controllers/adminController/adminSeekerController'
import AdminSeeker from '../../../usecases/admin/adminSeeker'


import AdminCompanyController from '../../../adapters/controllers/adminController/adminCompanyController'
import AdminCompany from '../../../usecases/admin/adminCompany'


const adminRouter: Router = express.Router()


const adminRepository = new AdminRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const adminAuth = new AdminAuth(adminRepository, jwtService)
const authController = new AdminAuthController(adminAuth)

const commonRespository = new CommonRepository()

const adminSeeker = new AdminSeeker(adminRepository, commonRespository)
const seekerController = new AdminSeekerController(adminSeeker)

const adminCompany = new AdminCompany(adminRepository, commonRespository, mailer)
const companyController = new AdminCompanyController(adminCompany)



//Atuh controller
adminRouter.post('/login', authController.adminLoginControl)


//User controller
adminRouter.get('/getAllSeekers', authMiddleware('admin'), seekerController.getAllUserControl)
adminRouter.post('/blockUnblockSeeker', authMiddleware('admin'), seekerController.usersBlockUnblockControl)


//Company controller
adminRouter.get('/getAllCompanies', authMiddleware('admin'), companyController.getAllCompaniesControl)
adminRouter.post('/companyVerification', authMiddleware('admin'), companyController.comapnyVerificationControl)




export default adminRouter