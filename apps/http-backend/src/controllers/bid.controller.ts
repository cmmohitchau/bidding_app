import { Request, Response } from "express";


export const bid = ( (req : Request , res : Response) => {

    
    return res.status(200).json({
        message : "bid created successfully"
    })
})