const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit =  require("express-rate-limit");
const { productRouter } = require("./routes/productRoutes/productRoutes.js");
const { authRouter } = require("./routes/authRoutes/authRoutes.js");
const { cartRouter } = require("./routes/cartRouter/cartrouter.js");
const { orderRouter } = require("./routes/orderRouter/order.js");
const { userRouter } = require("./routes/userRoutes/userRouter.js");
const { adminRouter } = require("./routes/adminRoutes.js");
const {reviewRouter} =  require("./routes/reviewRoutes.js");

const { startOrderCleaner } = require('./cron/orderCleaner.js');
require('dotenv').config();

// helmet
app.use(helmet());
// rate limit
app.set('trust proxy', 1);
const limiter =  rateLimit({
  windowMs:15*60*1000,
  max:1000,
  message:"too many requests please try later on"
})


app.use("/api",limiter)
// corn

startOrderCleaner();
// cors 
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())



// product
app.use("/api/admin", adminRouter)
app.use("/api/products", productRouter);
app.use("/api/review",reviewRouter)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// has to handle case 

// error handling miidle ware
app.use((err, req, res, next) => {
  console.log('Error', err);
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