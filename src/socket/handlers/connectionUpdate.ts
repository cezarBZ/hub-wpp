import { Boom } from "@hapi/boom";
import { DisconnectReason } from "baileys";
import QRCode from "qrcode";

export async function handleConnectionUpdate(update: any, sock: any) {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
  }

  if (
    connection === "close" &&
    (lastDisconnect?.error as Boom)?.output?.statusCode ===
      DisconnectReason.restartRequired
  ) {
    console.log("⚠️ Socket restart required, reconnecting...");
    require("../socket").startSocket(); // reinicia conexão
  }
}
