
import axios from "axios";
import { useRef, useState } from "react";
import Link from 'next/link'
import { redirect, useRouter } from "next/navigation";
import { BACKEND_URL } from "@repo/common/urls";
import { Spinner } from "@/components/ui/shadcn-io/spinner";


export const SignupPage = () => {
  const [name , setName] = useState("");
  const [password , setPassword] = useState("");
  const [email , setEmail ] = useState("");
  const [error , setError] = useState("");
  const [message , setMessage] = useState("");
  const [loading , setLoading] = useState(false);
  const router = useRouter();
 

  async function  clickHandler() {
    setLoading(true);
    setError("");
    setMessage("");
    if (!email || !password ) {
      setMessage("Required Email or Password")
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.post(`${BACKEND_URL}/signup` , {name , password , email});

      if(res.status == 200 ) {
        setError("");
        setMessage(res.data.message);
        router.push("/signin");
      } else {
        setError(res.data?.message || "Unable to Signup")
      }
      
            
    } catch (error : any) {
      setError(error.response?.data?.message || "Unable to Signup");
    }
    setLoading(false);  
  }

  return (
   <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md px-8 py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <p className="text-gray-500 text-center mb-8">Sign up your account</p>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            className="mt-1 px-3 py-2 w-full border rounded-xl outline-none focus:ring-2 focus:ring-green-400"
            type="text"
            placeholder="your Name"
          />
        </div>

         <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            className="mt-1 px-3 py-2 w-full border rounded-xl outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

       <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 px-3 py-2 w-full border rounded-xl outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="••••••••"
          />
        </div>

        
          {message && (
          <p className="text-sm flex justify-center text-red-500 mb-4">{message}</p>
        )}
        {error && (
          <p className="text-sm flex justify-center text-red-500 mb-4">{error}</p>
        )}
        

        <button
          className="bg-green-500 w-full py-3 rounded-xl flex justify-center text-white font-semibold hover:bg-green-600 transition-all duration-200"
          onClick={clickHandler}
        >
          {!loading ? "Sign up" : 
            <span ><Spinner  size={24} /></span>
          }
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}