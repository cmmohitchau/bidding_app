import { JWT_SECRET } from "@repo/backend-common/index";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}
export const middleware = async (req : Request , res : Response , next : NextFunction) => {

    try {
      const token = req.headers["authorization"] ?? "";      
      
      if(!token) return;
      console.log(" token in middleware " , token);
      
      
      const verified = jwt.verify(token as string , JWT_SECRET as string) as {userId : string};
      
      if(verified.userId) {
          req.id = verified.userId;
          next();
      } else {
          return res.status(401).json({
              message : "Unauthorized token"
          })
      }
    } catch(e) {
      return res.status(401).json({
              message : "Unauthorized token"
      })
    }

}