import express from 'express'
const router = express.Router()
import Auth from '../controllers/auth.js'

router.post('/login',Auth.login)

router.post('/register',Auth.register)

export= router