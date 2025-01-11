import express from 'express'

//Routes
import seekerRouter from './seekerRoutes'
import companyRouter from './companyRoutes'
import adminRouter from './adminRoutes'

const router = express.Router()

router.use('/seeker', seekerRouter)
router.use('/company', companyRouter)
router.use('/admin', adminRouter)




export default router