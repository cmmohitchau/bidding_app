import { Request, Response } from "express";
import { signupSchema , signinSchema , itemSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/index";

export const signup =  async (req : any , res : Response) => {

    const parsedData = signupSchema.safeParse(req.body);
    
    if(!parsedData.success) {
        return res.status(401).json({
            message : "Invalid data"
        })
    }

    try {
        const {email , name , password} = parsedData.data;

        const hashedPassword = await bcrypt.hash(password , 10);

        const existingUser = await prismaClient.user.findUnique({
            where : {
                email
            }
        });        
        

        if(existingUser) {
            return res.status(401).json({
                message : "User already exist"
            })
        }

        const user = await prismaClient.user.create({
            data : {
                email,
                name,
                password : hashedPassword,
            }
        })        

        return res.status(200).json({
            message : "user created successfully"
        })
    }   catch (e) {
        return res.status(501).json({
            message : "user creation failed"
        })
    } 
}

export const signin = ( async (req : Request , res : Response) => {

    const parsedData = signinSchema.safeParse(req.body);

    if(!parsedData.success) {
        return res.status(400).json({
            message : "Invalid data"
        }) 
    }

    const {email , password} = parsedData.data;

    const existingUser = await prismaClient.user.findUnique({
        where : {
            email
        }
    })
    console.log("jwt secret " , JWT_SECRET);
    

    if(!existingUser) {
        return res.status(400).json({
            message : "User does not exist"
        })
    }

    if(!existingUser.password) return;
    const matched = await bcrypt.compare(password , existingUser.password);
    
    if(!matched) {
        return res.status(400).json({
            message : "Incorrect Password"
        })
    }

    
    const token = jwt.sign({userId : existingUser.id } as JwtPayload , JWT_SECRET as string);

    return res.status(200).json({
        message : "signin successfully",
        user : existingUser,
        token
    })


})

export const users = ( async (req : Request, res : Response) => {

    try {
        const body = req.body;
        console.log(body);
        
        const users = await prismaClient.user.findMany();


        return res.status(200).json({
            message : "Users fetched successfully",
            users
        })    
    }   catch (e) {
        return res.status(501).json({
            message : "Error while fetching user details"
        })
    } 
})

