import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";
import { Bmo } from "@/components/bmo";

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return <Bmo prompt={props.prompt} />;
}

getStaticProps satisfies GetStaticProps<{ prompt: string }>;

export async function getStaticProps() {
  return {
    prompt: await fetch("/prompt.md").then((response) => response.text()),
  };
}
