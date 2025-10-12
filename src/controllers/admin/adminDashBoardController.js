
const adminServices = require("../../services/admin/adminDashBoardService");


exports.fetchAdminDashboardData = async (req, res) => {
  const dashboardData  = await adminServices.adminDashBoardDataService(req, res);

  res.status(200).json({
    success: true,
    message: "admin fetched data",
    result: 
      dashboardData, 
  });
};