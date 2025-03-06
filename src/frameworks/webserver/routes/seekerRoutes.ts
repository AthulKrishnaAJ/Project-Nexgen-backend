import express, {Router} from 'express'

//files
import SeekerRepository from '../../../adapters/repositories/seekerRepository'
import CommonRepository from '../../../adapters/repositories/commonRepository'
import Mailer from '../../services/mailer'
import JwtService from '../../services/jwt'
import authMiddleware from '../middlewares/roleAuthorization'
import AwsService from '../../services/aws/awsService'
import upload from '../../services/multerConfig'

//auth based files
import UserAuth from '../../../usecases/seeker/seekerAuth'
import AuthController from '../../../adapters/controllers/seekerController/authController'

//profile based files
import SeekerProfile from '../../../usecases/seeker/seekerProfile'
import SeekerProfileController from '../../../adapters/controllers/seekerController/seekerProfileController'

//job based files
import SeekerJobCases from '../../../usecases/seeker/seekerJobCases'
import SeekerJobController from '../../../adapters/controllers/seekerController/seekerJobController'

//cmompany based files
import SeekerCompanyCases from '../../../usecases/seeker/seekerCompanyCases'
import SeekerCompanyController from '../../../adapters/controllers/seekerController/seekerCompanyController'



const seekerRouter: Router = express.Router()
const repository = new SeekerRepository()
const commonRepository = new CommonRepository()
const mailer = new Mailer()
const jwtService = new JwtService()
const awsService = new AwsService()

const seekerAtuhCases = new UserAuth(repository, mailer, jwtService, commonRepository)
const authController = new AuthController(seekerAtuhCases)

const seekerJobCases = new SeekerJobCases(repository, commonRepository)
const jobController = new SeekerJobController(seekerJobCases)

const seekerProfileCases = new SeekerProfile(repository, commonRepository, awsService)
const profileController = new SeekerProfileController(seekerProfileCases)

const seekerCompanyCases = new SeekerCompanyCases(repository, commonRepository)
const seekerCompanyController = new SeekerCompanyController(seekerCompanyCases)



//auth based routes
seekerRouter.post('/signup', authController.sendOtpControl)
seekerRouter.post('/verifyOtp', authController.verifyOtpControl)
seekerRouter.post('/resendOtp', authController.resendOtpControl)
seekerRouter.post('/login', authController.loginControl)
seekerRouter.post('/emailVerify', authController.emailVerifyControl)
seekerRouter.post('/verifyOtpForChangePassword', authController.changePassowrdVerifyOtpControl)
seekerRouter.post('/changePassword', authController.changePasswordControl)
seekerRouter.post('/googleAuth', authController.googleAuthControl)


//profile based routes
seekerRouter.get('/getSeeker/:seekerId', authMiddleware('user'), profileController.getSeekerControl)
seekerRouter.post('/editProfile', authMiddleware('user'), profileController.editProfileControl)
seekerRouter.post('/uploadResume', authMiddleware('user'),upload.single('resume'), profileController.uploadResumeControl)
seekerRouter.post('/addSkill', authMiddleware('user'), profileController.addSkillControl)
seekerRouter.delete('/removeSkill', authMiddleware('user'), profileController.removeSkillControl)
seekerRouter.put('/removeResume', authMiddleware('user'), profileController.removeResumeControl)

//job based routes
seekerRouter.get('/getJobs', jobController.getAllJobsControl)
seekerRouter.post('/applyJob', authMiddleware('user'), jobController.applyJobControl)

//company based routes
seekerRouter.get('/getCompanies', seekerCompanyController.getAllCompanyControl)






export default seekerRouter