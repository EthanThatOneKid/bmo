import type { GenerativeModel } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const model = createGenerativeModel();
  const text = await request.text();
  const response = await executeModel(model, text);
  return new Response(response, { headers: { "Content-Type": "text/plain" } });
}

async function executeModel(model: GenerativeModel, text: string) {
  const { response } = await model.generateContent(text);
  return await response.text();
}

function createGenerativeModel() {
  if (process.env.GOOGLE_API_KEY === undefined) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}
