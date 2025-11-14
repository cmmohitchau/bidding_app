import { ClientComponent } from "./ClientComponent";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";

interface BidPageProps {
  params: {
    itemId: string;
  };
}
export default async function BidPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const id = Number(itemId);

  const res = await axios.get(`${BACKEND_URL}/item/${id}`);

  if (res.status === 200) {
    const data = res.data;
    return <ClientComponent item={data.item} />;
  } else {
    const error = res.data.error;
    return (
      <div className="flex justify-center items-center font-bold text-4xl">
        {error}
      </div>
    );
  }
}
