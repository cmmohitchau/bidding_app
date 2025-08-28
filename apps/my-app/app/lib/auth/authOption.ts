import CredentialsProvider from "next-auth/providers/credentials";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";

interface AppUser {
  id: string;
  email: string;
  name? : string;
  token : string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ): Promise<AppUser | null> {
        try {
          const res = await axios.post(`${BACKEND_URL}/signin`, {
            email: credentials?.username,
            password: credentials?.password,
          });
          console.log("res in auth : " , res);
          
          const data = res.data;
          if (res.status === 200 && res.data ) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              token: data.token
            };
          }

          // force NextAuth to throw backend message
          throw new Error(res.data.message || "Signin failed");
        } catch (err: any) {
          throw new Error(
            err.response?.data?.message || "Unable to signin"
          );
        }
      },
    }),
    GitHubProvider({
    clientId: process.env.GITHUB_ID ?? "abc",
    clientSecret: process.env.GITHUB_SECRET ?? "abcid"
  })
    
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user , account }) {
      
      if (user) {
        
        token.uid = (user as any).id;
        token.email = (user as any).email;
        token.accessToken = (user as any).token;
      }

      if (account?.provider === "github" && user) {
        
          const res = await axios.post(`${BACKEND_URL}/auth/github` , {
            name : user.name,
            providerId : account.providerAccountId
          });

          token.accessToken = res.data.token;
          token.uid = res.data.user.id;
      }
      
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {        
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        
      }
      (session as any).accessToken = token.accessToken;
      
      return session;
    },
  },
  pages : {
    signIn : '/signin'
  }
  
};



