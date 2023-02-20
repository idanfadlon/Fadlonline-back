
import User from '../models/user_model'
import { Request,Response } from 'express'
import bcrypt from 'bcrypt'

function sendError(res:Response, error:string){
    res.status(400).send({
        'err':error
    })

}

const register = async(req:Request, res:Response)=>{
    const email = req.body.email
    const password = req.body.password
    
    if(email == null || password == null){
        return sendError(res, 'The email or password are empty please fill')
    }

    try{
        const user = await User.findOne({'email' : email})
        if (user != null){
            return sendError(res, 'This email already in use go to login or try another one')
        }
    }catch(err){
        console.log("error: " + err)
        return sendError(res,'email check failed')

    }

    try {
        const salt = await bcrypt.genSalt(10)
        const encPass = await bcrypt.hash(password, salt)
        let newUser = new User({
            'email': email,
            'password': encPass
        })
        newUser = await newUser.save()
        res.status(200).send(newUser)//TODO: change implementation
    } catch (err) {
        sendError(res,'faild')
    }
}
const login = async(req:Request, res:Response)=>{
    const email = req.body.email
    const password = req.body.password
    
    if(email == null || password == null){
        return sendError(res, 'The email or password are empty please fill')
    }

    try{
        const user = await User.findOne({'email' : email})
        if (user == null) {
            return sendError(res, 'incorrect email or password')
        }
        
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            return sendError(res, 'incorrect email or password')
        }
        
        res.status(200).send({
            'message': "login pass"
        })

    }catch(err){
        console.log("error: " + err)
        return sendError(res,'email check failed')

    }
}

const logout = async(req:Request, res:Response)=>{
    res.status(400).send({'error':"not implemented yet"})
}


export = {register, login, logout}