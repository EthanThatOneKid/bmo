import { SYSTEM_PROMPT } from "@/lib/bmo";

export async function GET() {
  return new Response(SYSTEM_PROMPT, {
    headers: { "Content-Type": "text/plain" },
  });
}
