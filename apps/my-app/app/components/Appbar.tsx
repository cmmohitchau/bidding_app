"use client"
import { signIn , signOut , useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/darkMode"

export const Appbar = () => {
    const {data : session} = useSession();
    const router = useRouter();
    
    return (
        <div className="p-4 m-2 rouded-2xl border-b-2 w-full flex justify-end bg-transparent">
            
            <div className="mr-2">
                {!session ? (
                <>
                <Button onClick={() => signIn()} className="bg-green-400 hover:bg-green-600">Signin</Button>
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
    )
}