const orderModel = require('../models/orderModel');
const corn =  require('node-cron');
const deleteUnPaidOrder = async (req, res) => {
    const tenminutesAgo = new Date(Date.now() - 10 * 60 * 1000);
     const filter = {
         paymentStatus: "unpaid",
         createdAt: { $lt: tenminutesAgo }
     };
     const result = await orderModel.deleteMany(filter);
 };

 const startOrderCleaner = () => {
     corn.schedule('*/10 * * * *', async () => {
         try {
             await deleteUnPaidOrder();
             console.log('Unpaid orders older than 10 minutes deleted successfully');
         } catch (error) {
             console.error('Error deleting unpaid orders:', error);
         }
     });
 }
 module.exports = {
     startOrderCleaner
 };