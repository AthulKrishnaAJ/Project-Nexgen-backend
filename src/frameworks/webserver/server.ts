import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

//files
import connectToDatabase from '../database/mongoDB/mongoConnection'
import router from './routes/index'
import errorHandler from './middlewares/errorHandler'


const app = express()

connectToDatabase()

app.use(cors({ origin: ['http://localhost:5173', 'https://5845-103-214-235-16.ngrok-free.app'], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(morgan('dev'))

app.use('/api', router)

app.use(errorHandler)

export default app

