'use client'
import { useState } from "react";
import Link from 'next/link'
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Circle, Github } from "lucide-react"; // nice GitHub icon
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth/authOption";
import { Spinner, type SpinnerProps } from '@/components/ui/shadcn-io/spinner';

export default function SignInPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading , setLoading] = useState(false);
  const router = useRouter();
  const [message , setMessage] = useState("");

  async function clickHandler() {

    setLoading(true);
    if (!email || !password) {
      setError(true);
      setLoading(false);
      return;
    }
    

    try {
      const res = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });
      
      if(res?.error) {
        setMessage(res.error)
      } else if (res?.ok) {
        router.push("/");
      }
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md px-8 py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Sign in to your account</p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            className="mt-1 px-3 py-2 w-full border rounded-xl outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 px-3 py-2 w-full border rounded-xl outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="••••••••"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mb-4">Invalid credentials or missing fields.</p>
        )}
        {message && (
          <p className="text-sm font-bold text-red-500 flex justify-center mb-4">{message}</p>
        )}

        {/* Sign In Button */}
        <button
          className="bg-green-500 flex justify-center w-full py-3 rounded-xl text-white font-semibold hover:bg-green-600 transition-all duration-200"
          onClick={clickHandler}
        >
          {!loading ? "Sign in" : 
            <span ><Spinner  size={24} /></span>
          }
        </button>

        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <button
          onClick={async () => {
          await signIn("github" , {callbackUrl : "/"});


          }}
          className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-gray-100 transition-all"
        >
          <Github size={18} />
          Continue with GitHub
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}

        
          <Link href="/signup" className="text-green-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
