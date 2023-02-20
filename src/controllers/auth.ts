
// import Post from '../models/post_model'
import { Request,Response } from 'express'

const login = async(req:Request, res:Response)=>{
    res.status(400).send({'error':"not implemented yet"})
}

const register = async(req:Request, res:Response)=>{
    res.status(400).send({'error':"not implemented yet"})

}

export = {login, register}