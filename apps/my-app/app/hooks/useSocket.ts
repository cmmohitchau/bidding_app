"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"

export const useSocket = ( roomId : number) => {
    const { data : session } = useSession();
    const [loading , setLoading] = useState(true);
    const [socket , setSocket] = useState<WebSocket | null>(null);
    console.log(session);
    
    const token = session?.accessToken;
    console.log("token : " , token);
    
    useEffect( () => {
        if(!token) {
            console.log("No token");
            return;
            
        }
        console.log("In hooks in useEffect before connection");
        
       const ws = new WebSocket(`ws://localhost:8081/?token=${token}`);
        
       console.log("In hooks in useEffect after connection");
       ws.onopen = () => {

        ws.send(
            JSON.stringify({
                type : "JOIN_ROOM",
                roomId
            })
        )
        setSocket(ws);
        setLoading(false);

       };

       return () => {
        console.log("cleanup function");
        ws.close();
        
       }


    } , [roomId , token])

    return {loading , socket};

};