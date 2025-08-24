
"use client"
import { itemType } from "@/app/page";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BuyButtonProps {
  itemId : number;
}

export const BuyButton = ({itemId} : BuyButtonProps ) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/bid/${itemId}`)}
      className="bg-green-500 hover:bg-green-700"
    >
      Buy
    </Button>
  );
};
