import { Bmo } from "@/components/bmo";
import { BMO_PROMPT } from "@/lib/bmo";

export default async function Home(props: {
  searchParams: Record<string, string>;
}) {
  return <Bmo systemPrompt={BMO_PROMPT} chat={props.searchParams["chat"]} />;
}
