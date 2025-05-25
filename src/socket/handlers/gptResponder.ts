import { MessageUpsertType, WAMessage } from "baileys";
import { generateReply } from "../../services/llm";
import { checkIsPrivateMsg } from "../../utils/checkIsPrivateMsg";

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
      const jid = msg.key.remoteJid;

      if (!msg.key.fromMe && checkIsPrivateMsg(jid)) {
        const userMessage = msg.message?.conversation;
        const gptReply = await generateReply(systemPrompt, userMessage ?? "");
        await sock.sendMessage(msg.key.remoteJid!, { text: gptReply });
      }
    }
  }
}
