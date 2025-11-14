"use client"

import { Button } from "@/components/ui/button";
import sold from "@/public/Sold.png";
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
    console.log("item in client component : " , item);


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
<div className="max-w-6xl mx-auto mt-8 p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
  <div className="flex flex-col items-center">
    <div className="w-full max-w-md overflow-hidden mt-4">
      <img
        src={item.photo}
        alt={item.name}
        className="w-full h-auto p-4 transition-transform duration-300 hover:scale-105  hover:z-2"
      />
    </div>

    {/* Sold Out or Time Left */}
    <div className="mt-4 flex items-center justify-center">
      {item.soldOut ? (
        <Image src={sold} alt="Sold out" className="w-32" />
      ) : !expired ? (
        <p className="text-green-600 font-semibold text-lg">
          ⏳ Time Left: {days}d {hours}h {minutes}m {seconds}s
        </p>
      ) : (
        <p className="text-red-500 font-semibold text-lg">Auction Ended</p>
      )}
    </div>
  </div>

  {/* RIGHT: Product Details */}
  <div className="w-full max-w-xl mx-auto">
    <div className="border-b pb-4">
      <p className="text-2xl font-semibold">{item.name}</p>
      <div className="text-gray-600 mt-1">
        {item.description}
      </div>
    </div>

    <div className="mt-4 space-y-3">
      <p>
        <span className="font-bold text-gray-800">Seller ID:</span>{" "}
        <span className="text-gray-700">{item.SellerId}</span>
      </p>
      {item.BuyerId && (
        <p>
          <span className="font-bold text-gray-800">Buyer ID:</span>{" "}
          <span className="text-gray-700">{item.BuyerId}</span>
        </p>
      )}
    </div>

    <div className="flex flex-col gap-4 border-t pt-4">
      <div className="flex justify-between items-center">
        <p className="text-3xl font-bold text-gray-900">₹ {currPrice}</p>
      </div>

      {/* Bid Input */}
      <div className="w-full">
        <Input
          placeholder="Enter your bid amount"
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
        {priceInvalid && (
          <p className="text-red-500 text-sm mt-1">
            Minimum bid must be 1000
          </p>
        )}
      </div>

      {/* Bid Button */}
      <Button
        onClick={bid}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 text-lg"
        disabled={!session.data || expired || item.soldOut}
      >
        {item.soldOut ? "Sold Out" : expired ? "Auction Ended" : "Place Bid"}
      </Button>
    </div>
  </div>
</div>

    )
}