
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth/authOption";
import { getItems } from "./lib/actions/getItems";
import { ItemsClient } from "./components/pages/ItemsClient";


export interface itemType {
  id : number,
  name : string
  price : number
  description : string
  SellerId : string
  BuyerId? : string | null
  photo : string
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  const items = await getItems();
  
  return (
    <div >
      <div className="m-4">
        {session ? (
        <div className="text-6xl font-bold flex"><span className="hidden lg:block">Welcome Back ,</span>
         
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          {session.user?.name}
        </span>
        </div>
        ) : (
          <p>Please log in</p>
        )}
      </div>

      <ItemsClient items={items} />
      
    </div>
  );
}
