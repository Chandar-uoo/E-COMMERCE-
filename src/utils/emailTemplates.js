// src/utils/emailTemplates/orderReceipt.js

function orderReceiptTemplate(user, order, payMethod) {
  const subject = `Your payment was successful – Order Receipt ${order._id}`;

  const text = `
Hello ${user.name},

Thank you for shopping with us!

We have received your payment successfully. Here are the details of your order:

Order ID: ${order._id}
Payment Method: ${payMethod}
Payment Status: ${order.paymentStatus}
Order Status: ${order.orderStatus}
Shipping Address: ${order.address}

Items Ordered:
${order.items
    .map((i) => `- ${i.name} (x${i.quantity}) – $${i.price}`)
    .join("\n")}

Total Paid: $${order.totalPrice}

You can expect another update once your order is shipped.

If you have any questions, reply to this email and we’ll be happy to help.

Best regards,  
The RetailX E-Commerce Team
`;

  return { subject, text };
}
// src/utils/emailTemplates/otpVerification.js

function otpVerificationTemplate(email, otp) {
  const subject = "Your OTP Code for Secure Verification";

  const text = `Hello User,

We received a request to verify your email account: ${email}.
Please use the following One-Time Password (OTP) to complete your verification:

Your OTP Code: ${otp}

⚠️ This code will expire in 5 minutes.
If you did not request this, please ignore this email or contact our support team immediately.

Thank you,
Team RetailX
`;

  return { subject, text };
}



module.exports = {orderReceiptTemplate,otpVerificationTemplate}
