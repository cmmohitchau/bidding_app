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
  name?: string | null;
  message : string;
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

          if (res.status === 200 && res.data.user) {
            return res.data.user;
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
    async jwt({ token, user }) {
      console.log("user in jwt " , user);
      
      if (user) {
        token.uid = (user as any).id;
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log("user in session " , session);
        
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages : {
    signIn : '/signin'
  }
  
};



