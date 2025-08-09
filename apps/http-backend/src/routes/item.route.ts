
import { Router } from "express";
import { addItem, getItem, getItems, getUnsoldItem } from "../controllers/item.controller";
import { middleware } from "../middleware";

const router : Router = Router();

router.post("/" ,middleware, addItem );

router.get("/" , getItems);

router.get("/available" , getUnsoldItem);

router.get("/:item" , getItem);

export default router;