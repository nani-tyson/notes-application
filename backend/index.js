import express, { urlencoded } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

//configs
import { connectDB } from './configs/db.js';
dotenv.config()

//routes
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

const app = express()
app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)

const PORT = process.env.PORT | 3000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on ${PORT}`)
})