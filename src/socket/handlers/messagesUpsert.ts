import { MessageUpsertType, WAMessage } from "baileys";
import { broadcast } from "../../server";

type parametersTypes = {
  type: MessageUpsertType;
  messages: WAMessage[];
};
export function handleMessagesUpsert({ type, messages }: parametersTypes) {
  if (type === "notify") {
    for (const msg of messages) {
      console.log("📥 New message:", msg);
      broadcast({ type: "new_message", data: msg });
    }
  }
}
