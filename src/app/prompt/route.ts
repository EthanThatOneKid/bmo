import { BMO_PROMPT } from "@/lib/bmo";

export async function GET() {
  return new Response(BMO_PROMPT, {
    headers: { "Content-Type": "text/plain" },
  });
}
