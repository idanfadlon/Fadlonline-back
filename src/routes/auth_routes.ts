import express from "express"
const router = express.Router()
import Auth from "../controllers/auth.js"

/**
 * @swagger
 * tags:
 * name: Auth
 * description: The Authentication API
 */

router.post("/register", Auth.register)

router.post("/login", Auth.login)

router.get("/refresh", Auth.refresh)

router.get("/logout", Auth.logout)

export = router
