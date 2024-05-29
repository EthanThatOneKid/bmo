import { Bmo } from "@/components/bmo";

export default async function Home() {
  const prompt = await fetch("http://localhost:3000/prompt.md").then(
    (response) => response.text()
  );
  return <Bmo prompt={prompt} />;
}
