const authServices = require("../services/authServices");
exports.signup = async (req, res) => {
  const { newUser, refreshToken, accessToken } =
    await authServices.signupService(req, res);

  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: true,
    })
    .json({
      sucess: true,
      message: "successfully user created",
      result: {
        id: newUser._id,
        name: newUser.name,
        address: newUser.address,
        DOB: newUser.DOB,
        gender: newUser.gender,
        image: newUser.image,
        phoneNo: newUser.phoneNo,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
      accessToken,
    });
};
exports.login = async (req, res) => {
  const { emailExist, refreshToken, accessToken } =
    await authServices.loginService(req, res);
  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 6 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "login sucessfull",
      result: {
        id: emailExist._id,
        name: emailExist.name,
        address: emailExist.address,
        DOB: emailExist.DOB,
        gender: emailExist.gender,
        image: emailExist.image,
        phoneNo: emailExist.phoneNo,
        role: emailExist.role,
        isVerified: emailExist.isVerified,
      },
      accessToken,
    });
};

exports.logout = async (req, res) => {
  const logoutUser = await authServices.logoutService(req, res);
  res.status(200).json({
    success: true,
    message: "logout Suceesfully",
  });
};
exports.refreshToken = async (req, res) => {
  const { accessToken } = await authServices.accessTokenRenwal(req, res);
  res.status(200).json({
    success: true,
    message: "new access token genrated",
    accessToken,
  });
};
