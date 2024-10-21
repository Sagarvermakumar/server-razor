import { Router } from "express";
import { sendMessageUsingExNo } from "../controller/messageController.js";

const messageRouter = Router();

messageRouter.get("/send-messages", sendMessageUsingExNo);

export default messageRouter;
