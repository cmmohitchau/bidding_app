import { itemSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import { Request , Response } from "express"

export const addItem = ( async (req : Request , res : Response) => {
    
    const parsedData = itemSchema.safeParse(req.body);
    console.log(parsedData);
    
    if(!parsedData.success) {
        return res.status(401).json({
            message : "Invalid input"
        })
    }
    try {
        const userId = req.id;
        console.log(userId);
        

        const {name , initialPrice  , description , photo } = parsedData.data;

        const item = await prismaClient.item.create({
            data : {
                name,
                price : Number(initialPrice),
                description,
                SellerId : userId,
                photo
            }
        })

        return res.status(200).json({
            message : "Item added Successfully",
            itemId : item.id
        })  
    } catch(e) {
        return res.status(501).json({
            message : "server error unable to add item"
        })
        
    }
})

export const getUnsoldItem = ( async (req : Request , res : Response) => {

    const items = await prismaClient.item.findMany({
        where : {
            BuyerId : null
        }
    })

    return res.status(200).json({
        message : "all availabe items fetched successfully",
        items
    })    
})

export const getItems = async (req : Request , res : Response ) => {

    const items = await prismaClient.item.findMany();

    return res.status(200).json({
        message : "all items",
        items
    })
}

export const getItem = ( async (req : Request, res : Response) => {
    const rawName = req.query.name; //duke_350
    
    if (!rawName || typeof rawName !== 'string') {
        return res.status(400).json({ message: "Missing or invalid 'name' query parameter" });
    }

    const filteredName = rawName?.split("_").join(" ").toString();
    console.log("Filtered name:", filteredName);
    console.log("In getItem by name route");
        
    const item = await prismaClient.item.findMany({
        where : {
            OR : [
                { name: { contains: filteredName, mode: 'insensitive' } },
                { name: { contains: filteredName.split(" ")[0], mode: 'insensitive' } }  
            ]
        }
    })

    return res.status(200).json({
        message : "getItem created successfully",
        item
    })    
})

export const getItemById = (async (req : Request , res : Response) => {
    
    try {
        const id = Number(req.params.id);
        console.log(id);
        
        


        if(isNaN(id)) {
            return res.status(400).json({
                error : "Invalid item id"
            });
        }


        const item = await prismaClient.item.findUnique({
            where : {
                id
            }
        });

        console.log("item " , item);
        

        if(item == null) {
            console.log(" item null");
            
            return res.status(404).json({ error : "Item not found"});
        }

        return res.status(200).json(item); 
    } catch (err) {
        return res.status(500).json({ error : "Server error"});
    }

});