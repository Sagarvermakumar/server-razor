import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import messageRouter from "./Routes/messageRouter.js";
import paymentRouter from "./Routes/paymentsRouter.js";
import { Client } from "whatsapp-web.js";
import qrt from "qrcode-terminal";
const app = express();

const client = new Client();
dotenv.config({
  path: "./.env",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`A User Connected`, socket.id);

  socket.emit("GenratingQR", false);

  client.on("qr", (qr) => {
    console.log(qr);
    qrt.generate(qr, { small: true });
    socket.emit("QR", `${qr}`);
    socket.emit("GenratedQR", true);
  });

  client.on("ready", (msg) => {
    socket.emit("Client-Ready", true);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  app.post("/api/send-message", (req, res) => {
    try {
      client.initialize();
      const { message, users } = req.body;

      // Print or use the data
      console.log(`Message: ${message}`);
      console.log(`User: ${users}`);

      client.once("ready", async () => {
        const sendMessagePromis = users.map((user) => {
          client
            .sendMessage(user, message)
            .then((m) => {
              socket.emit("Success", true);
              console.log("message send", m.body);
              socket.emit("Message-Send", `Message Send ${m.body} to ${user} `);
            })
            .catch((e) => console.log(e.message));
        });
        await Promise.all(sendMessagePromis);
        //
      });
    } catch (error) {
      console.log(error.message);
      res.sendStatus(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // res.sendStatus(200).json({
  //   success: true,
  //   message: "Message Send SuccessFylly",
  // });
});


app.get("/", (req, res) => {
  res.status(200).send("This is home page");
});

// initilize whatsappwebjs client

app.use("/api", messageRouter);
app.use("/api", paymentRouter);

export default app;
