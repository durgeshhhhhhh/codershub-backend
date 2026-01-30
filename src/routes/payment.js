import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import razorpayInstance from "../utils/razorpay.js";
import Payment from "../models/payment.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import User from "../models/user.js";

export const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipType === "Silver" ? 50000 : 100000,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // console.log(payment);

    res.json({
      message: "Payment created successfully",
      data: savedPayment,
      keyId: process.env.RAZORPAY_TEST_KEY_ID,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      req.headers["x-razorpay-signature"],
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({
        error: "Invalid webhook signature",
      });
    }

    const { event, data } = req.body;

    const paymentDetails = data.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membershipType;
    await user.save();

    // if (event === "payment.captured") {
    // }

    // if (event === "payment.failed") {
    // }

    return res.status(200).json({
      message: "Webhook received successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});
