import { JWT_SECRET } from "@repo/backend-common/index";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const github = async (req : Request , res : Response) => {
    console.log("in github controller before");
    
    const { name , providerId } = req.body;
    console.log("in github controller after" , github);
    
    let user = await prismaClient.user.findUnique({
        where : {providerId}
    });

    if(!user) {
        user = await prismaClient.user.create({
            data : {name , provider : "github" , providerId}
        });
    }

    const token = jwt.sign({userId : user.id} as jwt.JwtPayload , JWT_SECRET as string);

    res.json({ token , user });
}