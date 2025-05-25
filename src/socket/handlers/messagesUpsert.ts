import { isJidGroup, MessageUpsertType, WAMessage } from "baileys";
import { broadcast } from "../../server";
import { MessageRepository } from "../../modules/messages/message.repository";
import { extractTextFromMessage } from "../../utils/extractText";
import { IMessage } from "../../interfaces/message.types";
import { detectMessageType } from "../../utils/detectMessageType";
import { extractMediaMeta } from "../../utils/extractMediaMeta";
import { mediaTypes } from "../../interfaces/media.types";
import { extractQuotedMessage } from "../../utils/extractQuotedMessage";

type parametersTypes = {
  type: MessageUpsertType;
  messages: WAMessage[];
};
export function handleMessagesUpsert({ type, messages }: parametersTypes) {
  if (type === "notify") {
    for (const msg of messages) {
      const jid = msg.key.remoteJid ?? "";
      const isJidGroups = isJidGroup(jid);

      if (!isJidGroups) {
        console.log("📥 New message:", msg);

        const messageType = detectMessageType(msg);
        const mediaMetadata = extractMediaMeta(msg, messageType as mediaTypes);

        const msgToSave: IMessage = {
          text: extractTextFromMessage(msg),
          type: messageType,
          chatId: msg.key.remoteJid ?? "",
          fromMe: msg.key.fromMe ?? false,
          from: msg.pushName ?? "",
          timestamp: msg.messageTimestamp as number,
          repliedByLLM: false,
          quotedMessage: extractQuotedMessage(msg),
          ...mediaMetadata,
        };
        MessageRepository.save(msgToSave);
        broadcast({ type: "new_message", data: msg.message });
      }
    }
  }
}
