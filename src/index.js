const express = require("express");
const { productRouter } = require("./routes/productRoutes/productRoutes.js");
const { authRouter } = require("./routes/authRoutes/authRoutes.js");
const { cartRouter } = require("./routes/cartRouter/cartrouter.js");
const { orderRouter } = require("./routes/orderRouter/order.js");
const { userRouter } = require("./routes/userRoutes/userRouter.js");
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
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// error handling miidle ware
app.use((err, req, res, next) => {
  console.log('Error', err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'something went wrong';
  const isOperational = err.isOperational || false;
  if (isOperational) {
    res.status(statusCode).json({
      success: false,
      message: message
    })
  } else {
    res.status(statusCode).json({
      success: false,
      error: 'internal server error'
    })
  }
})

module.exports = app;