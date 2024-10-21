import app, { server } from "./app.js";
import Razorpay from "razorpay";
import connectDB from './config/database.js'
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
  headers: {
    "X-Razorpay-Account": "<merchant_account_id>",
  },
});

connectDB()

server.listen(process.env.PORT, () => {
  console.log(`Server is runing on http://localhost:${process.env.PORT}`);
});
