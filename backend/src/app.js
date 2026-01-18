import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routers/auth.routes.js'
import errorHandler from './utils/errorHandler.js'


const app = express()

//access request
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//handle cookies
app.use(cookieParser())

//for access req body
app.use(urlencoded({extended: false}))
app.use(express.json())

//routes
app.use('/api/auth', authRouter)


app.get('/', (req, res)=>{
    res.send('rent nest server is running....')
})
//global error handler
app.use(errorHandler)

export default app