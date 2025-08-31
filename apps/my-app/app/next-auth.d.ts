import NextAuth from "next-auth";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;  
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string; // from backend response
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    email?: string;
    accessToken?: string; 
  }
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}
