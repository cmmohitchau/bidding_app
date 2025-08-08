
import { Router } from "express";
import { signin, signup, users } from "../controllers/user.controller";

const router : Router = Router();

router.post("/signup" , signup );

router.get("/users" , users);

router.post("/signin" , signin);

export default router;