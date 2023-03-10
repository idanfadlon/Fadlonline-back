import express from "express"
const router = express.Router()
import Post from "../controllers/post"
import Auth from "../controllers/auth"
router.get("/",Post.getAllPosts)

router.get("/:id", Auth.authenticateMiddleware, Post.getPostById)

router.post("/", Auth.authenticateMiddleware, Post.addNewPost)

router.put("/:id", Auth.authenticateMiddleware, Post.updatePostById)

export = router
