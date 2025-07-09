// handle uncaught exceptions 

process.on('uncaughtException',(err)=>{
    console.log('uncaughtException',err);
    process.exit(1);
})


const {connectDB} = require('./config/db.js');
const app =  require("./index.js");

// db connection
connectDB();
 const server = app.listen(3000,() => {
    console.log("server started to listen on port 3000");
} ); 


// handle uncaught rejection 
 process.on('unhandledRejection',(reason,promise)=>{
    console.log('unhandledRejection',reason);
    server.close(()=>process.exit(1));
 })