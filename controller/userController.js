const { catchAsyncError } = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/sendToken");
const path = require("path");

module.exports.userController = (req, res) => {
  res.json({ message: "this is homePage test" });
}

exports.userSignup = catchAsyncError(async (req, res) => {
  console.log('fun');
  const user = await new userModel(req.body).save();
  sendtoken(user, 201, res);
});
exports.getuser = catchAsyncError(async (req, res, next) => {
  const data = await userModel.findById(req.id).exec();
  res.json({
    data,
    authenticated: true,
  });
});
exports.userSignin = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email }).select("+password").exec();
  if (!user)
    return next(
      new ErrorHandler("user not found with this email address", 404)
    );
  const isMatch = user.comparePassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("wrong password", 404));
  sendtoken(user, 201, res);

});

exports.userSignout = catchAsyncError(async (req, res) => {

  res.clearCookie('token');
  res.json({ message: 'Succesfully signout' })

});

exports.usersendmail = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user)
    return next(
      new ErrorHandler("user not found with this email address", 404)
    );

  const url = `${req.protocol}://${req.get("host")}/user/forgot-password-link/${user._id}`;
  sendmail(req, res, next, url);

  user.resetPasswordToken = "1";
  await user.save();

  res.json({ user, url });
})

exports.userforgetlink = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.userId).exec();

  if (!user)
    return next(
      new ErrorHandler("user not found with this email address", 404)
    );


  if (user.resetPasswordToken == "1") {
    user.resetPasswordToken = "0";
    user.password = req.body.password
    await user.save();
  } else {
    return next(
      new ErrorHandler("Invailid password link ! try again", 500)
    );
  }
  res.status(200).json({ message: "password change successfully" })

})

exports.userresetpassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.id).exec();
  user.password = req.body.password;
  await user.save();
  sendtoken(user, 201, res);
});

