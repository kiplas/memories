import Image from "next/image";

const workflow = [
  {
    id: "a",
    name: "Create",
    summary: "Write a message and upload photos",
    palette: {
      background: "#FDF7DE",
      name: "#FFAF0F",
      summary: "#000000",
    },
    cover: {
      url: "/mock/index/workflow/a.png",
    },
  },
  {
    id: "b",
    name: "Design",
    summary: "Choose a beautiful template ",
    palette: {
      background: "#95DFB3",
      name: "#FFFFFF",
      summary: "#FFFFFF",
    },
    cover: {
      url: "/mock/index/workflow/b.png",
    },
  },
  {
    id: "c",
    name: "Schedule",
    summary: "Pick a delivery date ",
    palette: {
      background: "#FFCABC",
      name: "#FF4612",
      summary: "#000000",
    },
    cover: {
      url: "/mock/index/workflow/c.png",
    },
  },
  {
    id: "d",
    name: "Deliver",
    summary: "Your future self or loved one receives it — securely or as a printed heirloom.",
    palette: {
      background: "#D4F4FF",
      name: "#405BD8",
      summary: "#000000",
    },
    cover: {
      url: "/mock/index/workflow/d.png",
    },
  },
];

function Button() {
  return (
    <button className="group text-orange relative mt-84 h-68 w-full max-w-706 cursor-pointer overflow-clip rounded-full border border-current text-[1.25rem] font-semibold -tracking-tighter md:h-142 md:text-[2.5rem]">
      <div className="ease-slow relative z-1 duration-600 group-hover:scale-120 group-hover:text-white">Try the Interactive Demo</div>
      <div className="ease-slow bg-orange absolute top-[130%] left-1/2 hidden size-760 origin-center -translate-x-1/2 -translate-y-1/2 scale-10 rounded-full duration-500 group-hover:scale-100 md:block"></div>
    </button>
  );
}

export default function Workflow() {
  return (
    <section className="relative z-10 flex flex-col items-center bg-white px-32 pt-40 pb-84 select-none md:pt-80">
      <h2 className="md:text-h0-xl text-center text-[4.5rem]/[1em] font-bold -tracking-wider md:max-w-none">
        How <br className="md:hidden" /> it Works
      </h2>

      <ol className="mt-32 flex flex-col gap-y-32">
        {workflow.map(({ id, name, summary, palette, cover: { url } }, index) => (
          <li
            className="sticky top-(--top) aspect-706/392 max-w-706 rounded-[21px] [--offset:62px] md:rounded-[44px] md:[--offset:94px]"
            key={id}
            style={{
              "--height": "(min(706px, 100svw - 64px) * 0.55524)",
              "--top": `calc((100svh / 2) - (var(--height) / 2) - (var(--height) * 0.19971) + (var(--offset) * ${index}))`,
              background: palette.background,
            }}
          >
            <div className="pt-6 pr-80 pl-18 md:pt-12 md:pl-40">
              <div className="md:text-h1-xl text-[2rem] font-bold -tracking-tighter" style={{ color: palette.name }}>
                {name}
              </div>
              <div className="md:text-h3-xl mt-6 text-[0.75rem] font-medium -tracking-tighter md:mt-10" style={{ color: palette.summary }}>
                {summary}
              </div>
            </div>

            <div
              className="absolute top-20 right-20 grid size-29 place-content-center rounded-full text-[1.25rem] font-bold md:size-60 md:text-[2.5rem]"
              style={{ background: palette.name, color: palette.background }}
            >
              {index + 1}
            </div>

            <Image className="absolute right-4 bottom-4 aspect-323/198 w-323/706 md:right-20 md:bottom-20" src={url} alt="" width="323" height="198"></Image>
          </li>
        ))}
      </ol>

      <Button />
    </section>
  );
}
