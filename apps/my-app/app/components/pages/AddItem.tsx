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
  photo: null as File | null,
  targetTime: ""
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
    
    

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.photo) {
    alert("Please upload a valid image");
    return;
  }

  const file = formData.photo;
  const fileName = `${Date.now()}-${file.name}`;
  const fileType = file.type;

  const { data: presigned } = await axios.get(`${BACKEND_URL}/s3/put-presigned-url`, {
    params: { fileName, fileType },
    headers: {
      authorization: `${token}`,
    },
  });

  const uploadUrl = presigned.url;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": fileType,
    },
  });

  const imageUrl = uploadUrl.split("?")[0];
  const key = imageUrl.split(".amazonaws.com/")[1];

  await axios.post(
    `${BACKEND_URL}/item`,
    {
      name: formData.name,
      initialPrice: formData.initialPrice,
      description: formData.description,
      photo: key,
      targetTime: formData.targetTime,
    },
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );

  console.log("Item listed successfully");

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

          <div>
            <Label htmlFor="targetTime">TargetTime</Label>
            <input
              type="datetime-local"
              className="mt-2"
              id="targetTime"
              name="targetTime"
              placeholder="targetTime"
              value={formData.targetTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              className="mt-2"
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData(prev => ({ ...prev, photo: file }));
              }}
              required
            />


          </div>

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
