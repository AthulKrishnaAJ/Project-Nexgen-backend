import express, {Router} from 'express'


//files
import SeekerRepository from '../../../adapters/repositories/seekerRepository'
import Mailer from '../../services/mailer'
import UserAuth from '../../../usecases/seeker/seekerAuth'
import AuthController from '../../../adapters/controllers/seekerController/authController'

const seekerRouter: Router = express.Router()
const repository = new SeekerRepository()
const mailer = new Mailer()
const userAuth = new UserAuth(repository, mailer)
const controller = new AuthController(userAuth)

seekerRouter.post('/signup', controller.sendOtpControl)
seekerRouter.post('/verifyOtp', controller.verifyOtpControl)
seekerRouter.post('/resendOtp', controller.resendOtpControl)


export default seekerRouter