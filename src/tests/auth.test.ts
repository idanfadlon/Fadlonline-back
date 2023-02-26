import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

//TODO: implement refresh token time out test and logout 
const userEmail = "user1@gmail.com"
const userPassword ="12345" 
let accessToken = ''
let refreshToken= ''
beforeAll(async()=>{
    await Post.remove()
    await User.remove()
    })

afterAll(async ()=>{
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe("Auth Tests",()=>{
    
    
    test("Not authorized test",async()=>{
        const response = await request(app).get('/ppst')
        expect(response.statusCode).not.toEqual(200)

    })

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
        accessToken = response.body.accesstoken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })
    test("Using valid token test",async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT '+ accessToken)
        expect(response.statusCode).toEqual(200)
    })
    test("Using worng token test",async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT 1'+ accessToken)
        expect(response.statusCode).not.toEqual(200)
    })







        

    test("Logout test",async () => {
        const response = await request(app).post('/auth/logout').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })
   
})
    