import { BACKEND_URL } from "@repo/common/urls"
import axios from "axios"

export const getItems = async () => {
    
    try {
        const res = await axios.get(`${BACKEND_URL}/item/items`);

        return res.data.items;
    } catch(e) {
        throw new Error("No items are available");
    }
    
}