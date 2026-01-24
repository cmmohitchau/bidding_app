import { Router } from "express";
import { postPresignedUrl } from "../controllers/s3.controller";

const router : Router = Router();
router.post("/get-presigned-url" , postPresignedUrl);

export default router;