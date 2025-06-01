const { connectDB } = require("./config/db.js");
const express = require("express");
const {productRouter} = require("./routes/productRoutes.js"); 
require('dotenv').config()

//server cretaed by express instance
const app = express();
// to read all jso data
app.use(express.json());



// product

app.use("/",productRouter);
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


