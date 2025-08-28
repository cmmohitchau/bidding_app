
import { Router } from "express";
import { addItem, getItem, getItemById, getItems, getUnsoldItem } from "../controllers/item.controller";
import { middleware } from "../middleware";

const router : Router = Router();

router.post("/" , middleware , addItem );

router.get("/items" , getItems);

router.get("/available" , getUnsoldItem);

router.get("/" , getItem);

router.get("/:id" , getItemById);

export default router;