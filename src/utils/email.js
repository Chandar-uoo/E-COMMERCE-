const nodemailer =  require("nodemailer");
const AppError = require("./AppError")
require("dotenv").config();


const transporter =  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
})


async function sendEmail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.log(err);
    
    throw new AppError("Some problem email doest send",500);
  }
}
module.exports = {sendEmail}