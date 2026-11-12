import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader)
    if(!authHeader){
        return res.status(401).json({
            mesage:"Token não informado"
        })
    }
    const [, token] = authHeader.split(" ");
    console.log("TOKEN:", token);

    if(!token){
        return res.status(401).json({
            mesage: 'Token não informado ou mal formatado'
        })
    }
    try{
        const decoded = jwt.verify(
            token,
            "SEGREDO_DO_TOKEN"
        )
        next()
    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            mesage:"Token Invalido"
        })
    }
}