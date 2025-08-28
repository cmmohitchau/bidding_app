"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export function SellItemForm() {
  const {data : session} = useSession();

  const [formData, setFormData] = useState({
    name: "",
    initialPrice: "",
    description: "",
    photo: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  if (!session) {
      console.error("No session found");
      return;
    }

    const token = session.accessToken;
    console.log("token in sell " , token);
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(
      `${BACKEND_URL}/item`,
      formData,{
        headers : {
          authorization : token
        }
      }
    );
    router.push("/items");
  };

  return (
    <Card className="max-w-lg mx-auto mt-8 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-green-600">
          🛒 Sell an Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              className="mt-2"
              id="name"
              name="name"
              placeholder="e.g. iPhone 14 Pro"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Initial Price */}
          <div>
            <Label htmlFor="initialPrice">Initial Price (₹)</Label>
            <Input
              className="mt-2"
              id="initialPrice"
              name="initialPrice"
              type="number"
              placeholder="Enter starting price"
              value={formData.initialPrice}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="mt-2"
              id="description"
              name="description"
              placeholder="Write a short description..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Photo */}
          <div>
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              className="mt-2"
              id="photo"
              name="photo"
              type="url"
              placeholder="https://example.com/item.jpg"
              value={formData.photo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            🚀 List Item for Sale
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
