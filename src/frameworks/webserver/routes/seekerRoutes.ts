import express, {Router} from 'express'


//files
import SeekerRepository from '../../../adapters/repositories/seekerRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'
import authMiddleware from '../middlewares/roleAuthorization'

//auth files
import UserAuth from '../../../usecases/seeker/seekerAuth'
import AuthController from '../../../adapters/controllers/seekerController/authController'

//profile files
import SeekerProfile from '../../../usecases/seeker/seekerProfile'
import SeekerProfileController from '../../../adapters/controllers/seekerController/seekerProfileController'

const seekerRouter: Router = express.Router()
const repository = new SeekerRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const seekerAtuh = new UserAuth(repository, mailer, jwtService, commonRepository)
const authController = new AuthController(seekerAtuh)


const seekerProfile = new SeekerProfile(repository, commonRepository)
const profileController = new SeekerProfileController(seekerProfile)



seekerRouter.post('/signup', authController.sendOtpControl)
seekerRouter.post('/verifyOtp', authController.verifyOtpControl)
seekerRouter.post('/resendOtp', authController.resendOtpControl)
seekerRouter.post('/login', authController.loginControl)
seekerRouter.post('/emailVerify', authController.emailVerifyControl)
seekerRouter.post('/verifyOtpForChangePassword', authController.changePassowrdVerifyOtpControl)
seekerRouter.post('/changePassword', authController.changePasswordControl)

seekerRouter.get('/getSeeker/:seekerId', authMiddleware('user', jwtService), profileController.getSeekerControl)
seekerRouter.post('/editProfile', authMiddleware('user', jwtService), profileController.editProfileControl)




export default seekerRouter