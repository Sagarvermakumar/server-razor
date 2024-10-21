import { Client } from "whatsapp-web.js";
import qrt from "qrcode-terminal";


const client = new Client();

export const sendMessageUsingExNo = async (req, res) => {
  client.on("qr", (qr) => {
    qrt.generate(qr, { small: true });
    res.status(200).json({
      success: true,
      qr,
    });
  });

  
  client
    .initialize()
    .then((d) => console.log("inidilize ", d))
    .catch((err) => console.log(err));
  const users = req.body.users;

  const message = req.body.message;

  try {
    client.once("ready", async () => {
      const sendMessagePromis = users.map((user) => {
        client
          .sendMessage(user, message)
          .then((m) => {
            console.log("message send", m.body);
            res.status(200).json("Messages sent successfully.");
          })
          .catch((e) => console.log(e.message));
      });
      await Promise.all(sendMessagePromis);
      //
    });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json("Error sending messages");
  }
};
