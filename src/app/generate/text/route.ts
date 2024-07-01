import type { Content, GenerativeModel } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BmoMessage } from "@/lib/bmo";
import { BMO_PROMPT } from "@/lib/bmo";

export async function POST(request: Request) {
  const model = createGenerativeModel();
  const messages: BmoMessage[] = await request.json();
  const response = await executeModel(model, toAPI(messages));
  return new Response(response, { headers: { "Content-Type": "text/plain" } });
}

async function executeModel(model: GenerativeModel, contents: Content[]) {
  const { response } = await model.generateContent({ contents });
  return await response.text();
}

function createGenerativeModel() {
  if (process.env.GOOGLE_GEN_AI_API_KEY === undefined) {
    throw new Error("GOOGLE_GEN_AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

function toAPI(messages: BmoMessage[]): Content[] {
  return [
    {
      role: "model",
      parts: [{ text: BMO_PROMPT }],
    },
    ...messages.map((message) => ({
      role: message.actor === "bmo" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
  ];
}
