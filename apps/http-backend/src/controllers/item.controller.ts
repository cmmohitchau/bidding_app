import { itemSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request , Response } from "express";
import { generatePresignedUrl } from "./s3.controller";

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
        

        const {name , initialPrice  , description , photo , targetTime } = parsedData.data;

        const item = await prismaClient.item.create({
            data : {
                name,
                price : Number(initialPrice),
                description,
                SellerId : userId,
                photo,
                targetTime : new Date(targetTime)
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

  try {
    const items = await prismaClient.item.findMany();    

    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const url = await generatePresignedUrl(item.photo);
        return {
          ...item,
          photo: url,
        };
      })
    );
    

    return res.json({ items: itemsWithUrls });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch items" });
  }
}

export const getItem = ( async (req : Request, res : Response) => {
    const rawName = req.query.name; 
    
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
        
        if(!item) {            
            return res.status(404).json({ error : "Item not found"});
        }
        console.log("item in api : " , item);
        
        const url = await generatePresignedUrl(item.photo);
        console.log("url in api : " , url);
        
        const itemWithUrl = {
            ...item,
            photo : url
        }

        return res.status(200).json({
            message : "Item fetched successfully",
            item : itemWithUrl
        }); 
    } catch (err) {
        return res.status(500).json({ error : "Server error"});
    }

});

export const searchItem = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;

    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      return res.status(400).json({
        message: "Invalid or missing search keyword",
      });
    }

    const items = await prismaClient.item.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 16,
    });

    const itemsWithUrls = await Promise.all(
        items.map( async (item) => {
            const url = await generatePresignedUrl(item.photo);
            return {
                ...item,
                photo : url
            }
        })
    )
    return res.status(200).json({
      message: "Items fetched successfully",
      items : itemsWithUrls,
    });
  } catch (error) {
    console.error("Error while searching items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

