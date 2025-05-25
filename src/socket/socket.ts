import makeWASocket, { useMultiFileAuthState } from "baileys";
import P from "pino";
import { handleCredsUpdate } from "./handlers/credsUpdate";
import { handleConnectionUpdate } from "./handlers/connectionUpdate";
import { handleMessagingHistorySet } from "./handlers/messagingHistorySet";
import { handleMessagesUpsert } from "./handlers/messagesUpsert";
import { gptResponder } from "./handlers/gptResponder";

export async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
  const sock = makeWASocket({
    logger: P({ level: "info" }),
    auth: state,
  });

  sock.ev.on("creds.update", (creds) => handleCredsUpdate(saveCreds, creds));
  sock.ev.on("connection.update", (update) =>
    handleConnectionUpdate(update, sock)
  );
  sock.ev.on("messaging-history.set", handleMessagingHistorySet);
  sock.ev.on("messages.upsert", handleMessagesUpsert);
  sock.ev.on("messages.upsert", (a) => gptResponder({messages: a.messages, sock: sock, type: a.type}));

  return sock;
}
