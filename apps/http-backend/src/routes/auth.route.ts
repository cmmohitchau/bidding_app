import { prismaClient } from "@repo/db/client";
import { Request , Response } from "express";
import { Router } from "express";
import { github } from "../controllers/jwt.controller";
const router : Router = Router();


router.post("/github" , github);

export default router;