import { MessageUpsertType, WAMessage } from "baileys";
import { broadcast } from "../../server";
import { checkIsPrivateMsg } from "../../utils/checkIsPrivateMsg";

type parametersTypes = {
  type: MessageUpsertType;
  messages: WAMessage[];
};
export function handleMessagesUpsert({ type, messages }: parametersTypes) {
  if (type === "notify") {
    for (const msg of messages) {
      const jid = msg.key.remoteJid;

      if (checkIsPrivateMsg(jid)) {
        console.log("📥 New message:", msg);
        broadcast({ type: "new_message", data: msg.message });
      }
    }
  }
}
