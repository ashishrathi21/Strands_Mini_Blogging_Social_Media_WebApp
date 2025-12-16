import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import dataBaseConnection from './config/db.js'
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import cors from 'cors'

const app = express()
dataBaseConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use('/api/v1/users', userRoute)
app.use('/api/v1/posts', postRoute)

app.get('/api/v1', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
