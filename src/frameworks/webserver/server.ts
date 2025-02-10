import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

//files
import connectToDatabase from '../database/mongoDB/mongoConnection'
import router from './routes/index'
import errorHandler from './middlewares/errorHandler'


const app = express()

connectToDatabase()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(morgan('dev'))

app.use('/api', router)

app.use(errorHandler)

export default app

