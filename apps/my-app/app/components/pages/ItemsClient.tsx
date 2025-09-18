"use client";

import { BuyButton } from "@/app/lib/actions/BuyButton";
import sold from "@/public/Sold.png";
import {
    Card,
    CardHeader,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
    CardFooter

} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { itemType } from "@/app/items/page";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";

export const ItemsClient = () => {
  const [items , setItems] = useState<itemType[]> ([]);
    useEffect( () => {
        async function getItems() {
          const res = await axios.get(`${BACKEND_URL}/item/items`);
          setItems(res.data.items);
        }
        getItems();
    } , [items]);
    
    return (
        
      <div className="mx-4 grid md:grid-cols-3 sm:grid-cols-2 gap-6 lg:grid-cols-4">
        {
          items.length > 0 ? (
            items.map( (item : itemType) => (
              <Card className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300" key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <CardAction>
                    <BuyButton itemId={item.id} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>{item.photo}</p>
                </CardContent>
                <CardFooter className="flex justify-between mt-4">
                  <p className="font-bold text-2xl">Rs. {item.price}</p>
                  {!item.soldOut && <p className="font-bold text-2xl text-green-600">Available</p>}
                  {item.soldOut && <Image src={sold} alt="Sold Icon" width={100} height={100} />
}
                </CardFooter>
              </Card>
            ))
          ) : null
        }
      </div>
    )
}