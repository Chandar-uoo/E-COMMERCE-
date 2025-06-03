const { connectDB } = require("./config/db.js");
const express = require("express");
const {productRouter} = require("./routes/productRoutes/productRoutes.js"); 
const {authRouter} = require("./routes/authRoutes/signup.js");
const {cartRouter} = require("./routes/cartRouter/cartrouter.js")
require('dotenv').config()
const cookieParser = require("cookie-parser")

//server cretaed by express instance
const app = express();
// to read all jso data
app.use(express.json());
app.use(cookieParser())



// product
app.use("/",productRouter);
app.use("/",authRouter);
app.use("/",cartRouter);
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


