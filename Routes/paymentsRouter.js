import { Router } from "express";
import {
  checkout,
  getAllPaymentByDate,
  getAllPayments,
  getKey,
  paymentVerification,
} from "../controller/paymentsController.js";

const paymentRouter = Router();

paymentRouter.get("/get-key", getKey);
paymentRouter.route("/checkout").post(checkout);
paymentRouter.route("/payment-verification").post(paymentVerification);

paymentRouter.route("/get-all-payments").get(getAllPayments);
paymentRouter.route("/get-all-payment-by-date").get(getAllPaymentByDate);

export default paymentRouter;
