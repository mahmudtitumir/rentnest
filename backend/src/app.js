import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'


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


app.get('/', (req, res)=>{
    res.send('rent nest server is running....')
})

// app.use()

export default app