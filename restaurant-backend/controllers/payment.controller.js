import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log("🔍 Creating Razorpay order for orderId:", orderId);

    const order = await Order.findById(orderId);
    console.log("Fetched order:", order);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const options = {
      amount: order.totalPrice * 100, // convert to paise
      currency: "INR",
      receipt: orderId.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", razorpayOrder);

    // Save Payment entry with status "Pending"
    const payment = await Payment.create({
      orderId: order._id,
      amount: order.totalPrice,
      method: "Razorpay",
      status: "Pending",
      transactionId: razorpayOrder.id,
    });
    console.log("💾 Payment record created:", payment);

    res.json({ razorpayOrder, paymentId: payment._id });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// Verify Payment & Update DB
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, razorpayPaymentId } = req.body;
    console.log("🔍 Verifying payment with data:", { paymentId, orderId, razorpayPaymentId });

    const payment = await Payment.findById(paymentId);
    console.log("Fetched payment record:", payment);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = "Paid";
    payment.transactionId = razorpayPaymentId;
    await payment.save();
    console.log("💾 Payment record updated:", payment);

    // Also update Order
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
    });
    console.log("✅ Order payment status updated for orderId:", orderId);

    res.json({ message: "Payment verified and updated", payment });
  } catch (err) {
    console.error("❌ Payment Verification Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};