import { Request, Response } from "express";
import { S3Client , GetObjectCommand , PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const s3Client = new S3Client({
    region : process.env.REGION ,
    credentials : {
        accessKeyId : process.env.ACCESS_KEY  || "",
        secretAccessKey : process.env.SECRET_KEY || ""
    }
});


export const postPresignedUrl = async (req : Request , res : Response) => {
   try {
     const { fileName , fileType } = req.body;

     if(!fileName || !fileType) {
        return res.status(400).json({
            error : "fileNae and fileType are required"
        });
     }
     const originaFileName = `${fileName}` + uuidv4();
     const finalName = `${originaFileName}.${fileType}`;

     const command = new PutObjectCommand({
        Key : finalName,
        Bucket : process.env.BUCKET,
        ContentType : fileType as string
    });    


    const url = await getSignedUrl(s3Client , command , { expiresIn : 3600}); 
    
    console.log("url in backend : " , url);

    res.status(200).json({
        message : "put object url fetched successfuly",
        url,
        finalName
    })

   } catch(e) {
    res.status(500).json({
        message : "server error",
        error : e
    })
   }
}