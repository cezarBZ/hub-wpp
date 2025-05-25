import { isJidGroup, MessageUpsertType, WAMessage } from "baileys";
import { generateReply } from "../../services/llm";
import { checkIsPrivateMsg } from "../../utils/checkIsPrivateMsg";
import { MessageRepository } from "../../modules/messages/message.repository";
import { detectMessageType } from "../../utils/detectMessageType";
import { extractTextFromMessage } from "../../utils/extractText";
import { IMessage } from "../../interfaces/message.types";

type parametersTypes = {
  type: MessageUpsertType;
  messages: WAMessage[];
  sock: any;
};
export async function gptResponder({ type, messages, sock }: parametersTypes) {
  const systemPrompt = `
Você é atendente da loja Mens collection, especializada em moda masculina.
Nosso horário é das 8 às 18 . Seja educado e objetivo.
`;
  if (type === "notify") {
    for (const msg of messages) {
      const jid = msg.key.remoteJid ?? "";
      const isJidGroups = isJidGroup(jid);

      if (!isJidGroups) {
        const userMessage = msg.message?.conversation;
        const gptReply = await generateReply(systemPrompt, userMessage ?? "");
        await sock.sendMessage(msg.key.remoteJid!, { text: gptReply });

        const message: IMessage = {
          chatId: jid,
          fromMe: true,
          from: "LLM",
          type: "text",
          text: gptReply,
          timestamp: new Date().getDate(),
          repliedByLLM: true,
          quotedMessage: {
            type: detectMessageType(msg),
            text: extractTextFromMessage(msg),
            from: msg.pushName,
            fromMe: false,
          },
        };

        await MessageRepository.save(message);
      }
    }
  }
}
