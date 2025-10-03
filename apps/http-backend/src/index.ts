
import express from "express";
import cors from "cors";
import { HTTP_PORT } from "@repo/backend-common/index";
import userRoute from "./routes/user.route";
import itemRoute from "./routes/item.route";
import bidRoute from "./routes/bid.route";
import authRoute from "./routes/auth.route";
import s3Route from "./routes/s3.route";


const app = express();
app.use(express.json());

app.use(cors());

app.use("/" , userRoute);
app.use("/item" , itemRoute);
app.use("/bid" , bidRoute);
app.use("/auth" , authRoute);
app.use("/s3" , s3Route);

app.listen(HTTP_PORT , () => {
    console.log("http backend is running at port " , HTTP_PORT);
    
})