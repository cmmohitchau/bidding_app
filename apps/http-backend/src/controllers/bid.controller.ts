import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";


export const bid = ( async (req : Request , res : Response) => {
    const itemId = req.body.itemId;

    const item = await prismaClient.item.update({
        where : {
            id : itemId
        },
        data : {
            soldOut : true
        }
    })
    
    console.log(item.BuyerId);
    
    
    return res.status(200).json({
        message : "bid created successfully",
        item
    })
})