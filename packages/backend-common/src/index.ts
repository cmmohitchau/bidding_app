import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const HTTP_PORT = process.env.HTTP_PORT ||  3001 ;
export const WS_PORT = process.env.WS_PORT || 3000  ;