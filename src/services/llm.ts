// services/llm.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function generateReply(
  systemPrompt: string,
  userMessage: string
): Promise<string | null> {
  const res = await openai.chat.completions.create({
    model: "gpt-4", // ou gpt-3.5-turbo
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });

  return res.choices?.[0]?.message?.content ?? null;
}
