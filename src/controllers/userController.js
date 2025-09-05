const userServices = require("../services/userServices");

exports.userCheck = (req, res) => {
  const user = userServices.userCheckService(req, res);
  res.status(200).json({
    success: true,
    message: "user details",
    result: {
      id: user._id,
      name: user.name,
      address: user.address,
      DOB: user.DOB,
      gender: user.gender,
      image: user.image,
      phoneNo: user.phoneNo,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};
exports.updateUserDetails = async (req, res) => {
  const updatedUser = await userServices.updateUserDetailsService(req, res);
  res.status(200).json({
    success: true,
    message: "user details updated",
    result: {
      id: updatedUser._id,
      name: updatedUser.name,
      image: updatedUser.image,
      address: updatedUser.address,
      phoneNo: updatedUser.phoneNo,
      DOB: updatedUser.DOB,
      address: updatedUser.address,
    },
  });
};
exports.updateUserPassword = async (req, res) => {
  await userServices.updateUserPasswordService(req, res);
  res.status(200).json({
    success: true,
    message: "succesuffuly password updated",
  });
};
exports.userEmailOtpSend = async (req, res) => {
  await userServices.userEmailOtpSendService(req, res);
  res.status(200).json({
    success: true,
    message: "succesuffuly email sended",
  });
};
exports.userEmailVerify = async (req, res) => {
  const { emailToken } = await userServices.userEmailVerifyService(req, res);
  res
    .status(200)
    .cookie("emailToken",emailToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60  * 1000,
      sameSite: true,
    })
    .json({
      success: true,
      message: "succesuffuly email verified",
    });
};
