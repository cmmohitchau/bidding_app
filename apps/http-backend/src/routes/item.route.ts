
import { Router } from "express";
import { addItem, getItem, getItems } from "../controllers/item.controller";

const router : Router = Router();

router.post("/" , addItem );

router.get("/" , getItems);

router.get("/:item" , getItem);

export default router;