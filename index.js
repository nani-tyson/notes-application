import express, { urlencoded } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

//configs
import { connectDB } from './configs/db.js';
dotenv.config()

const app = express()
app.use(cors())
app.use(urlencoded({extends: true}))


const PORT = process.env.PORT | 3000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on ${PORT}`)
})