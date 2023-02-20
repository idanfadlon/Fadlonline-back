import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'


const newPostMessage = 'This is the new test post message'
const newPostSender = '123456'
// let newPostId =''
const nonExistentsender ='idan'
const updatedPostMessage = 'This is the updated post message'

const userEmail = "user1@gmail"
const userPassword ="12345" 
beforeAll(async()=>{
    await Post.remove()
    })

afterAll(async ()=>{
    await Post.remove()
    mongoose.connection.close()
})

describe("Auth Tests",()=>{
    
    
    test("Register test",async()=>{
        const response = await request(app).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
        
    })
    
    test("Login test",async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })
   
})
    