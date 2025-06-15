const { connectDB } = require("./config/db.js");
const express = require("express");
const {productRouter} = require("./routes/productRoutes/productRoutes.js"); 
const {authRouter} = require("./routes/authRoutes/signup.js");
const {cartRouter} = require("./routes/cartRouter/cartrouter.js");
const {orderRouter} = require("./routes/orderRouter/order.js");
const {userRouter} =  require("./routes/userRoutes/userRouter.js");
require('dotenv').config();
const cors = require("cors")
const cookieParser = require("cookie-parser")

//server cretaed by express instance
const app = express();
// to read all jso data
// cors 

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser())



// product
app.use("/",productRouter);
app.use("/",authRouter);
app.use("/",userRouter)
app.use("/",cartRouter);
app.use("/",orderRouter);
// db connection
connectDB()
.then(()=>{
    console.log("sucessfully connected");   
})
.catch((err)=>{
    console.error("connection failed");
});
app.listen(3000,() => {
    console.log("server started to listen on port 3000");
} ); 


