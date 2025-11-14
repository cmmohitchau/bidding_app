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
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@repo/common/urls";
import { itemType } from "@/app/items/page";

export const ItemsClient = () => {
  const [items, setItems] = useState<itemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get(`${BACKEND_URL}/item/items`);
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-xl py-10">
        Loading items…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-xl py-10">
        No items available
      </div>
    );
  }

  return (
    <div className="mx-4 grid md:grid-cols-3 sm:grid-cols-2 gap-6 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300"
        >
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardAction>
              <BuyButton itemId={item.id} />
            </CardAction>
          </CardHeader>

          <CardContent>
            <img
              src={item.photo}
              alt={item.name}
              width={300}
              height={200}
              className="rounded-md w-full h-48 object-cover"
            />
          </CardContent>

          <CardFooter className="flex justify-between mt-4">
            <p className="font-bold text-2xl">Rs. {item.price}</p>

            {item.soldOut ? (
              <Image src={sold} alt="Sold" width={70} height={70} />
            ) : (
              <p className="font-bold text-2xl text-green-600">Available</p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
