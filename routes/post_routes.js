const express = require('express')
const router = express.Router()
const Post = require('../controllers/post')

router.get('/',Post.getAllPosts)

router.get('/:id',Post.getPostById)

router.post('/', Post.addNewPost)

router.put('/:id',Post.updatePostById)
module.exports = router