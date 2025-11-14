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

export async function generatePresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour validity
}

export const getPresignedUrl = async (req : Request , res : Response) => {
    try {
        const key = req.query.key as string;
         
        const url = await generatePresignedUrl(key);
        console.log("url in backend : " , url);
        
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
     const { fileName , fileType } = req.query;
     console.log(req.query);
     
     if(!fileName || !fileType) {
        return res.status(400).json({
            error : "fileNae and fileType are required"
        });
     }

     const command = new PutObjectCommand({
        Key : `uploads/${fileName}`,
        Bucket : process.env.BUCKET,
        ContentType : fileType as string
    });    

    const url = await getSignedUrl(s3Client , command , { expiresIn : 60});    
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