
const productModel = require("../../models/productModel");
const userModel = require("../../models/user");
const orderModel = require("../../models/orderModel");


exports.adminDashBoardDataService = async (req, res) => {


const [productStatsResult, orderStatsResult, totalCustomers] = await Promise.all([
   productModel.aggregate([
    {$facet:{
      productCount:[
        {$match:{isDeleted:false}},
        {$count:"productsCount"}
      ],
      topThreeProducts:[
        {$sort:{soldCount:-1}},
        {$limit:3},
        {$project:{
          _id:1,
          title:1,
          soldCount:1,
          price:1
        }}
      ]
    }}
  ]),
 orderModel.aggregate([
    {
      $facet: {
        revenue: [
          { $match: { paymentStatus: "paid" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
            },
          },
        ],
        ordersPending: [
          {
              $match: {
                $and: [
                  { orderStatus: "processing" },
                  { paymentStatus: "paid" },
                ],
              },
           
          },
          {$count:"totalPending"}
        ],
      },
    },
  ]),
 userModel.countDocuments()
]);

const productStats = productStatsResult[0];
const totalProducts = productStats.productCount[0]?.productsCount || 0;
const topThreeProducts = productStats.topThreeProducts;

const orderStats = orderStatsResult[0];
const totalRevenue = orderStats.revenue[0]?.totalRevenue || 0;
const totalPendingOrders = orderStats.ordersPending[0]?.totalPending || 0;


const dashboardData = {
  totalProducts,
  topThreeProducts,
  totalRevenue,
  totalPendingOrders,
  totalCustomers
};
return dashboardData;
}