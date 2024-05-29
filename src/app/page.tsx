import { Bmo } from "@/components/bmo";

export default async function Home() {
  const systemPrompt = await fetch("http://localhost:3000/prompt.md").then(
    (response) => response.text()
  );
  return <Bmo systemPrompt={systemPrompt} />;
}
