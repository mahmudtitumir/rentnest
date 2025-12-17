import express from 'express'
import * as authController from '../controller/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/registration', authController.registration)
authRouter.post('/verify-regi', authController.verifyRegistration)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)

export default authRouter