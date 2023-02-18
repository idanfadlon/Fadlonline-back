import express from 'express'
const router = express.Router()
import Post from '../controllers/post'

router.get('/',Post.getAllPosts)

router.get('/:id',Post.getPostById)

router.post('/', Post.addNewPost)

router.put('/:id',Post.updatePostById)

export= router