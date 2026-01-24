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


export function SellItemForm(){
  const {data : session} = useSession();
  
  if (!session) {
    console.error("No session found");
    return;
  }

  const token = session.accessToken;
  const router = useRouter();

  const [file , SetFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    initialPrice: "",
    description: "",
    photo: "",
    targetTime : ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const fileHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if(selectedFile) SetFile(selectedFile);
    
  }   

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if(!file) {
        alert("please select a file first");
        return;
      }

      const fileName = file.name;
      const fileType = (file.type).split("/")[1];
      console.log("fileType : " , fileType)

      const response = await axios.post(`${BACKEND_URL}/s3/get-presigned-url` , {
        fileName,
        fileType
      });

      console.log("after response in fe");
      const put_url = response.data.url; 
      const finalName = response.data.finalName;  

      console.log("put url : " , put_url);
      console.log("key : " , finalName);
      
      const result = await axios.put(put_url , file ,{
        headers : {
          "Content-Type" : file.type || "application/octet-stream"
        }
      });

      console.log("result : " , result);


      
      formData.photo = finalName;
      
      await axios.post(`${BACKEND_URL}/item` , formData , {
        headers : {authorization : token}
      });
      alert("product added successfully")
      router.push("/items");
      
    } catch(e) {
      console.log("error while uploading");
      console.log(e)
      
    }
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
              placeholder="Upload image"
              onChange={fileHandler}
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
