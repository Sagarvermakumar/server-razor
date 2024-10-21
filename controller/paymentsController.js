import crypto from "crypto";
import { Payment } from "../model/paymentModel.js";
import { instance } from "../server.js";

export const getKey = (req, res) =>
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY,
  });

export const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(amount);
    if (!amount)
      return res.status(404).json({
        success: false,
        message: "Enter Ammount.",
      });

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const secretKey = process.env.RAZORPAY_API_SECRET;

    if (!secretKey) {
      return res
        .status(500)
        .send("Server configuration error: Secret key missing");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database comes here

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // console.log(`${process.env.CLIENT_URL}/Payment-success?reference=${razorpay_payment_id}`);

      res.redirect(
        `${process.env.CLIENT_URL}/Payment-success?reference=${razorpay_payment_id}`
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const allPayments = await Payment.find({});

    res.status(200).json({
      success: true,
      data: allPayments,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: "Payment Not found By Given Date.",
    });
  }
};
export const getAllPaymentByDate = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);
    if (!date)
      return res.status(200).json({
        success: false,
        data: "Select date",
      });

    const targetDate = new Date(date).toDateString();

    const allPayments = await Payment.find({});

    const filterByDate = allPayments.filter(
      (payment) => payment.createdAt.toDateString() === targetDate
    );

    res.status(200).json({
      success: true,
      data: filterByDate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};
