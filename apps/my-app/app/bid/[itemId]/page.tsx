

import { ClientComponent } from "./ClientComponent";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";


interface BidPageProps {
    params : {
        itemId : string
    };
}
export default async function BidPage({ params } : BidPageProps) {    
                
        const id = Number(params.itemId);
        
        const res = await axios.get(`${BACKEND_URL}/item/${id}`);
        
        if(res.status == 200) {
            
            const item = res.data;
            
            
            return <ClientComponent item={item} />
        } else {
            const error = res.data.error;
            return (
                <div className="flex justify-center items-center font-bold text-4xl">
                    
                    {error}
                </div>
            )
        }
        
        

        
    

}