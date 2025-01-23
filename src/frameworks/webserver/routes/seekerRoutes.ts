import express, {Router} from 'express'


//files
import SeekerRepository from '../../../adapters/repositories/seekerRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'
import UserAuth from '../../../usecases/seeker/seekerAuth'
import AuthController from '../../../adapters/controllers/seekerController/authController'

const seekerRouter: Router = express.Router()
const repository = new SeekerRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const userAuth = new UserAuth(repository, mailer, jwtService, commonRepository)
const controller = new AuthController(userAuth)

seekerRouter.post('/signup', controller.sendOtpControl)
seekerRouter.post('/verifyOtp', controller.verifyOtpControl)
seekerRouter.post('/resendOtp', controller.resendOtpControl)
seekerRouter.post('/login', controller.loginControl)
seekerRouter.post('/emailVerify', controller.emailVerifyControl)
seekerRouter.post('/verifyOtpForChangePassword', controller.changePassowrdVerifyOtpControl)


export default seekerRouter