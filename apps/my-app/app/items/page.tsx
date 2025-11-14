import { getServerSession } from "next-auth";
import { ItemsClient } from "../components/pages/ItemsClient";
import { getItems } from "../lib/actions/getItems";
import { authOptions } from "../lib/auth/authOption";


export interface itemType {
  id : number,
  name : string
  price : number
  description : string
  SellerId : string
  BuyerId? : string | null
  photo : string,
  targetTime : Date | string
  soldOut : boolean
}
export default async function Items () {
    const session = await getServerSession(authOptions);
    
    return(
        <div>
            <div className="m-4">
              {session ? (
              <div className="text-6xl font-bold flex"><span className="hidden lg:block">Welcome Back ,</span>
              
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              {session.user?.name}
              </span>
              </div>
              ) : null
              }
            </div>
            
          <ItemsClient />
        </div>
    )
}