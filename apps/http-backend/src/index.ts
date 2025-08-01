
import express from "express";
import cors from "cors";
import { HTTP_PORT } from "@repo/backend-common/index";
import userRoute from "./routes/user.route";
import itemRoute from "./routes/item.route";
import bidRoute from "./routes/bid.route";



const app = express();

app.use(cors());

app.use("/" , userRoute);
app.use("/item" , itemRoute);
app.use("/bid" , bidRoute);

app.listen(HTTP_PORT , () => {
    console.log("http backend is running at port " , HTTP_PORT);
    
})