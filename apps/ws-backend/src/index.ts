import { WebSocket, WebSocketServer } from "ws";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/index";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({port : 8081});

interface User {
    userId : string;
    socket : WebSocket;
    rooms : Set<number>;
}

const rooms : Map<number , Set<User>> = new Map(); //main room registry room1 -> [user1 , user2 , user3]


const users : User[] = [];

function checkUser(token : string) : string | null {
    
    try {
        const decoded = jwt.verify(token as string , JWT_SECRET as string) as {userId : string};

        if(decoded) {
            return decoded.userId;
        }

        return null;


    }  catch(e ) {
        return null;
    }

}

function sendDataToAll(roomId : number , price : number ) {
    const roomUsers = rooms.get(roomId);
    if(!roomUsers) return;

    const message = JSON.stringify({
        type : "UPDATE_PRICE",
        roomId,
        price
    });

    for (const user of roomUsers) {
        if(user.socket.readyState === WebSocket.OPEN) {
            user.socket.send(message);
            user.socket.send(JSON.stringify({ type : "ACK" , message : "bid_success"}))
            

        }
    }

}

wss.on("connection" , (socket , request) => {
    console.log("client connected");
    
    const url = request.url;

    if(!url) {
        socket.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);

    const token = queryParams.get("token") || "";

    const userId = checkUser(token);

    if(!userId) return null;

    const user : User = {userId , socket , rooms : new Set() };


    socket.on("message" , async (data) => {
        
        const parsedData = JSON.parse(data.toString());
        const { type , roomId } = parsedData;
        console.log("parsedData in ws : " , parsedData);
        

        if(!type) return;

        switch(parsedData.type) {
            case 'JOIN_ROOM':
                if(!rooms.has(roomId)) {
                    rooms.set(roomId , new Set());
                }
                rooms.get(roomId)!.add(user);
                user.rooms.add(roomId);
                socket.send(JSON.stringify({ type : "ACK" , message : "joined_success"}))
                console.log({ type : "ACK" , message : "joined_success"});

                break;
            case 'LEAVE_ROOM':
                if(rooms.has(roomId)) {
                    rooms.get(roomId)!.delete(user);
                }

                user.rooms.delete(roomId);
                socket.send(JSON.stringify({ type : "ACK" , message : "leave_room_success"}))
                console.log({ type : "ACK" , message : "leave_room_success"});

                break;
            case 'BID':
                if(parsedData.price < 1000) return;

                const res = await prismaClient.item.update({
                    where : {
                        id : roomId
                    },
                    data : {
                        price : {
                            increment : Number(parsedData.price)
                        }
                    }
                })

                if(!res) return;
                sendDataToAll(roomId , res.price);

                break;
            default:
                socket.send(JSON.stringify({ type : "ERROR" , error : "Unknown message type" }));
                break;
                
        }
        
    })

    socket.on("close", () => {
        user.rooms.forEach((roomId) => {
            rooms.get(roomId)?.delete(user);

            if (rooms.get(roomId)?.size === 0) {
            rooms.delete(roomId);
            }
        });
    });

})