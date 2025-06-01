/* const username = "lambertliya84";
const password = "yHGqmR5SO7270aob"; */
const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URL)
};
module.exports = {
    connectDB,
};

