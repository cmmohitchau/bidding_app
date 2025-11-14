"use client";

import { useRouter } from "next/navigation";
import { itemType } from "../items/page";
import Image from "next/image";
import sold from "@/public/Sold.png";

interface ProductProps {
    items : itemType[]
}

export const Products = ({ items } : ProductProps) => {
    const router = useRouter();
    return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Available Items</h1>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 ? (
          items.map((item: itemType) => (
            <div
              key={item.id}
              onClick={() => router.push(`/bid/${item.id}`)}
              className="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              
              <div className="relative">
                <Image
                src={item.photo}
                alt={item.name}
                width={300}
                height={300}
                className="h-56 w-full object-cover"
                />

              </div>

              <div className="p-4">
                <h2 className="text-2xl font-semibold text-gray-800 truncate">{item.name}</h2>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-xl font-bold text-gray-700">
                    ₹{item.price}
                  </p>
                  {!item.soldOut ? (
                    <p className="text-lg font-semibold text-green-600">
                      Available
                    </p>
                  ) : (
                    <p className="text-lg font-semibold text-red-500">
                      <Image
                        src={sold}
                        alt="sold out"
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">No items available</p>
        )}
      </div>
    </div>
  );
}