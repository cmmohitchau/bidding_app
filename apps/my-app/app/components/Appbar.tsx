"use client"
import { signIn , signOut , useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/darkMode"

export const Appbar = () => {
    const {data : session} = useSession();
    const router = useRouter();
    
    return (
        <div className="p-4 m-2 rouded-2xl border-b-2 w-full flex justify-between bg-transparent">
            <div>
                <Button onClick={(e) => router.push('/sell')}
                className="bg-gradient-to-r from-green-300 to-green-500 
                            text-white font-bold px-6 py-2 
                            text-xl
                            rounded-2xl shadow-md 
                            transition-all duration-300 
                            hover:from-green-400 hover:to-green-600 
                            hover:scale-105 hover:shadow-lg"
                >
                🛒 Sell Item
                </Button>
            </div>
            <div className="flex ">

                <div className="mr-2">
                    {!session ? (
                    <>
                    <Button onClick={() => signIn()} className="bg-green-400 hover:ring-blue-500 hover:bg-green-600">Signin</Button>
                    </>

                    ) : 
                    ( 
                        <Button onClick={() => signOut()} className="bg-red-400 hover:bg-red-600">Logout</Button>
                    )}
                </div>
                <div className="mr-2">
                    <ModeToggle />
                    
                </div>
            </div>


        </div>
    )
}