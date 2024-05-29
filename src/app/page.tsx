import { Bmo } from "@/components/bmo";
import { SYSTEM_PROMPT } from "@/lib/bmo";

export default async function Home() {
  return <Bmo systemPrompt={SYSTEM_PROMPT} />;
}
