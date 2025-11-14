import { BACKEND_URL } from "@repo/common/urls"
import axios from "axios"

export const getItems = async () => {
    
    
        const res = await axios.get(`${BACKEND_URL}/item/items`);
        console.log(res.data);
        

        return res.data.items;

}