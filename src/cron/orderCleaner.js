const orderModel = require('../models/orderModel');
const {CronJob}=  require("cron");
const deleteUnPaidOrder = async () => {
    const tenminutesAgo = new Date(Date.now() - 10 * 60 * 1000);
     const filter = {
         paymentStatus: "unpaid",
         createdAt: { $lt: tenminutesAgo }
     };
     const result = await orderModel.deleteMany(filter);
 };

 const startOrderCleaner = () => {
    const job = new CronJob('*/10 * * * *', async () => {
        try {
          await deleteUnPaidOrder();
          console.log('🕒 Order cleanup job ran');
        } catch (error) {
          console.error('Error running cron job:', error);
        }
      });
    
      job.start(); 
 }
 module.exports = {
     startOrderCleaner
 };
