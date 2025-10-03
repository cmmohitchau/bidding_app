import { Request, Response } from "express";
import { S3Client , GetObjectCommand , PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region : process.env.REGION,
    credentials : {
        accessKeyId : process.env.ACCESS_KEY || "",
        secretAccessKey : process.env.SECRET_KEY || ""
    }
});

export const getPresignedUrl = async (req : Request , res : Response) => {
    try {
        const key = req.query.key as string;
         
        const command = new GetObjectCommand({
            Key : key,
            Bucket : process.env.BUCKET
        })

        const url = await getSignedUrl(s3Client , command);

        res.status(200).json({
            message : "get presigned url fetched successfully",
            url
        })
    } catch (e) {
        res.status(500).json({
            message : "server error",
            error : e
        })
    }
} 

export const postPresignedUrl = async (req : Request , res : Response) => {
   try {
     const key = req.query.key as string;

     const command = new PutObjectCommand({
        Key : key,
        Bucket : process.env.BUCKET
    });

    const url = await getSignedUrl(s3Client , command);

    res.status(200).json({
        message : "put object url fetched successfuly",
        url
    })

   } catch(e) {
    res.status(500).json({
        message : "server error",
        error : e
    })
   }
}