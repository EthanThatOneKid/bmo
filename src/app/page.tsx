import { Bmo } from "@/components/bmo";
import { BMO_PROMPT } from "@/lib/bmo";

export default async function Home() {
  return <Bmo systemPrompt={BMO_PROMPT} />;
}
