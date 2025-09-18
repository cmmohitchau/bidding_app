"use client"

import { Button } from "@/components/ui/button";
import sold from "@/public/Sold.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { itemType } from "@/app/items/page";
import { useSocket } from "@/app/hooks/useSocket";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/app/components/ItemSkeleton";
import { useCountdown } from "@/app/hooks/useCounter";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";


export function ClientComponent({ item } : {item : itemType | null }) {
    const session = useSession();
    const [buyerId , setBuyerId ] = useState("");
    const [price , setPrice] = useState("1000");
    const [priceInvalid , setPriceInvalid ] = useState(false);
    const [error , setError ] = useState<null | string>(null);
    const [ currPrice , setCurrPrice ] = useState(item?.price);

    if(!item) return;
    const {loading , socket} = useSocket(item.id);
    const { days, hours, minutes, seconds, expired } = useCountdown(item.targetTime);
    const roomId = item.id;
    const id = session.data?.user.id;

    async function updateDB() {
        
        const result = await axios.put(`${BACKEND_URL}/bid` , {itemId : item!.id});
        const buyerId = result.data.item.buyerId;
        setBuyerId(buyerId);
    }

    if(!item.soldOut && expired) {
        updateDB();
        
    }

    useEffect( () => {        
        
    } , [item]);

    useEffect( () => {
        if(!socket) return;

        const handleMessage = (event : MessageEvent ) => {
            const parsedData = JSON.parse(event.data);
            console.log(parsedData);
            
            switch(parsedData.type) {
                case "ERROR" :
                    setError(parsedData.error);
                    break;
                case "UPDATE_PRICE" :
                    const { roomId , price , buyerId  } = parsedData;
                    console.log("parsedData from ws in client : " , parsedData);
                    
                    setCurrPrice(price);
                    
                    break;
                default :
                    setError("Websocket unable to connect");
                    break;

            }
        }
        
        socket.addEventListener("message" , handleMessage);


        return () => {
            socket.removeEventListener("message" , handleMessage);
            console.log("cleanup function in client");
            
        }
    } , [socket])
    
    function bid() {
        if(Number(price) < 1000) {
            setPriceInvalid(true);
            return; 
        }
        if(!socket) return;

        socket.send(
            JSON.stringify({
                type : "BID",
                price : Number(price),
                roomId,
                userId : id
            })
        );
        
    }


    if (!item) {
        return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Item not found</h1>
        </div>
        );
    }
    
    if(loading) {
        return(
            <div>
                <SkeletonCard />
            </div>
        )
    }

    return (
    <div className="p-8 mt-8 flex justify-center">
        <Card className="max-w-lg w-full">
            <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
            <img
                src={item.photo}
                alt={item.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p>
                <span className="font-bold">Seller ID:</span> {item.SellerId}
            </p>
            {item.BuyerId && (
                <p>
                <span className="font-bold">Buyer ID:</span> {item.BuyerId}
                </p>
            )}
            </CardContent>
            <CardFooter className="flex flex-col">
                <div className="flex justify-between w-full mb-4">
                    <p className="text-2xl font-bold mt-6">Rs. {currPrice}</p>
                    {!expired && <p className="text-xl font-semibold text-green-600 mt-6">Time Left: {days}d {hours}h {minutes}m {seconds}s</p>}
                    {item.soldOut && <Image src={sold} alt="Sold out" width={100} height={100} /> }
                </div>
                
                <Input 
                placeholder="1000" 
                onChange={(e) => setPrice(e.target.value)} 
                />

                {priceInvalid && (
                    <p className="text-red-500 text-sm mt-1">
                        Minimum bid must be 1000
                    </p>
                )}

                <Button
                onClick={bid}
                className="bg-green-500 mt-2 w-full"
                disabled={!session.data || expired}
                >
                Bid
                </Button>

            </CardFooter>
        </Card>
    </div>
    )
}