import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL

const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoUrl as string)
        console.log('Mongo Db connection established')
    } catch (error: any) {
        console.error('Error in Mongo Db connection: ', error.message)
        process.exit(1)
    }
}



export default connectToDatabase