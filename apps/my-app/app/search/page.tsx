import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";
import { Products } from "../components/Products";

interface SearchPageProps {
    searchParams : { query?: string}
}

export default async function Search({ searchParams } : { searchParams : Promise< { query?: string}>}) {
    
    const query = (await searchParams).query || "";
    console.log("query in search page : " , query);
    
    let items = [];

    if(query) {
        const response = await axios.get(`${BACKEND_URL}/item/search?keyword=${query}`);
        items = response.data.items;
        console.log(response.data);
        
    }

    return(
        <div>
            {
                items.length > 0 ?
                <Products items={items} />
                : <p>No Item found</p>
            }
            
        </div>
    )
    
}