import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { configs } from '../configs/index.js';

export function verifyToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token){
        return res.status(422).json({'msg': 'An authentication token is required to access this route!'});
    }

    try{
        const secret_key = configs.jwt_secret;

        const decoded = jwt.verify(token, secret_key!) as { userId: string };
        (req as any).userId = decoded.userId;

        next();
    }catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        });

        console.log(`A server error occurred: ${error}`);
    }
}