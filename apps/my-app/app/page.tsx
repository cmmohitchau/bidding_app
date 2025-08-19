
import { Appbar } from "./components/Appbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth/authOption";
import { getItems } from "./lib/actions/getItems";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuyButton } from "./lib/actions/BuyButton";


export interface itemType {
  id : number,
  name : string
  price : number
  description : string
  SellerId : string
  BuyerId? : string
  photo : string
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  const items = await getItems();
  console.log("items in home ; " , items);
  
  
  return (
    <div >
      <Appbar />
      <div className="m-4">
        {session ? (
        <p>Welcome , {session.user?.name}</p>
        ) : (
          <p>Please log in</p>
        )}
      </div>

      <div className="mx-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        {
          items.length > 0 ? (
            items.map( (item : itemType) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <CardAction>
                    <BuyButton itemName={item.name} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>{item.photo}</p>
                </CardContent>
                <CardFooter>
                  <p className="font-bold text-2xl">Rs. {item.price}</p>
                </CardFooter>
              </Card>
            ))
          ) : null
        }
      </div>

      
    </div>
  );
}
