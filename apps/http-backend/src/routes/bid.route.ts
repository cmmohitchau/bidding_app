
import { Router } from "express";
import { bid } from "../controllers/bid.controller";

const router : Router = Router();

router.post("/" , bid );



export default router;