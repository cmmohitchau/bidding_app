
import { Router } from "express";
import { bid } from "../controllers/bid.controller";

const router : Router = Router();

router.put("/" , bid );



export default router;