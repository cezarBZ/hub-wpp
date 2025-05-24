import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "baileys";
import type { Boom } from "@hapi/boom";
import P from "pino";
import QRCode from "qrcode";

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
  const sock = makeWASocket({
    logger: P(),
    auth: { creds: state.creds, keys: state.keys },
    // getMessage: (a) => {},
    //   printQRInTerminal: true,
  });

  const phoneNumber = "5581997621549";

  // this will be called as soon as the credentials are updated
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    // on a qr event, the connection and lastDisconnect fields will be empty

    // In prod, send this string to your frontend then generate the QR there
    if (qr) {
      // as an example, this prints the qr code to the terminal
      console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (
      connection === "close" &&
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
        DisconnectReason.restartRequired
    ) {
      // create a new socket, this socket is now useless
      connectToWhatsApp();
    }
  });

  sock.ev.on(
    "messaging-history.set",
    ({
      chats: newChats,
      contacts: newContacts,
      messages: newMessages,
      syncType,
    }) => {
        console.log(newMessages);
      // handle the chats, contacts and messages
    }
  );

  sock.ev.on("messages.upsert", ({ type, messages }) => {
    if (type == "notify") {
      // new messages
      for (const message of messages) {
        // messages is an array, do not just handle the first message, you will miss messages
        console.log(message)
      }
    } else {
      // old already seen / handled messages
      // handle them however you want to
    }
  });

  //   sock.ev.on("connection.update", async (update) => {
  //     const { connection, lastDisconnect, qr } = update;
  //     if (connection == "connecting" || !!qr) {
  //       // your choice
  //       const code = await sock.requestPairingCode(phoneNumber);
  //       // send the pairing code somewhere
  //     }
  //   });
}

connectToWhatsApp();
