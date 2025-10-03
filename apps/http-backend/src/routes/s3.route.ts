import { Router } from "express";
import { getPresignedUrl, postPresignedUrl } from "../controllers/s3.controller";

const router : Router = Router();

router.get("/get-presigned-url" , getPresignedUrl);

router.get("/post-presigned-url" , postPresignedUrl);



export default router;