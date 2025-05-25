import { Boom } from "@hapi/boom";
import { DisconnectReason } from "baileys";
import QRCode from "qrcode";
import { startSocket } from "../socket";

export async function handleConnectionUpdate(update: any, sock: any) {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
  }

  if (connection === "close") {
    if (
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
      DisconnectReason.restartRequired
    ) {
      console.log("⚠️ Socket restart required, reconnecting...");
      startSocket(); // reinicia conexão
    }

    if (
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
      DisconnectReason.loggedOut
    ) {
      console.log(
        "🚪 Desconectado permanentemente. Reautenticação necessária."
      );
    } else {
      console.log("🔄 Conexão encerrada. Tentando reconectar...");
      startSocket(); // sua função que reinicia o socket
    }
  }

  if (connection === "open") {
    console.log("✅ Conectado ao WhatsApp");
  }
}
