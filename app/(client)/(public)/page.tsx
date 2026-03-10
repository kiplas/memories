import { ExtendedHeader } from "@/components/header";
import Hero from "@/sections/index/hero";
import Workflow from "@/sections/index/workflow";
import Experiences from "@/sections/index/experiences";
import Preview from "@/sections/index/preview";
import Loop from "@/sections/index/loop";
import Comments from "@/sections/index/comments";
import Plans from "@/sections/plans";
import Security from "@/sections/security";
import FAQ from "@/sections/index/faq";
import Story from "@/sections/index/story";
import Outro from "@/sections/outro";

export default function Index() {
  return (
    <>
      <ExtendedHeader light />
      <Hero />
      <Workflow />
      <Experiences />
      <Preview />
      {/* <Loop /> */}
      <Comments />
      <Plans />
      <Security />
      <FAQ />
      <Story />
      <Outro />
    </>
  );
}
