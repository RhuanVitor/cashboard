import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from "../models/user.model.js";
import { configs } from "../configs/index.js";

export async function register(req: Request, res: Response){
    const { name, email, password, confirm_password } = req.body;
    
    if(!name){
        return res.status(422).json({'msg': 'Name is required!'});
    }

    if(!email){
        return res.status(422).json({'msg': 'Email is required!'});
    }
    
    if(!password){
        return res.status(422).json({'msg': 'Password is required!'});
    }

    if(password != confirm_password){
        return res.status(422).json({'msg': 'The passwords do not match!'});
    }

    try{
        const userExist = await User.findOne({ email });

        if(userExist){
            return res.status(422).json({'msg': 'Email already registered, try another one!'});
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ name, email, password: hashedPassword });

        await user.save();

        const token = createToken(user._id!)

        res.status(200).json({
            'msg': 'Account created successfully!',
            user,
            token
        });

    } catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function login(req: Request, res: Response){
    const { email, password } = req.body;

    if(!email){
        return res.status(422).json({'msg': 'Email is required!'});
    }
    
    if(!password){
        return res.status(422).json({'msg': 'Password is required!'});
    }

    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(422).json({'msg': 'No account was created with this email!'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(422).json({'msg': 'Incorrect password!'});
        }

        const token = createToken(user._id!);

        res.status(200).json({
            'msg': 'Login successful!',
            user,
            token
        })

    } catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        });

        console.log(`A server error occurred: ${error}`);
    }
}

function createToken(userId: {}){
    return jwt.sign(
        { userId }, 
        configs.jwt_secret!,
        { expiresIn: '7d' },
    );
}