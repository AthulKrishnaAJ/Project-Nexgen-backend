import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

//files
import connectToDatabase from '../database/mongoDB/mongoConnection'
import routes from './routes'

dotenv.config()

const app = express()

connectToDatabase()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(morgan('dev'))

app.use('/api', routes)




export default app

