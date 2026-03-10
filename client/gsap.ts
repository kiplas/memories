import gsap from "gsap";
import Draggable from "gsap/Draggable";
import ScrollTrigger from "gsap/ScrollTrigger";
import InertiaPlugin from "gsap/InertiaPlugin";
import SplitText from "gsap/SplitText";

function start() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(Draggable);
  gsap.registerPlugin(SplitText);
  gsap.registerPlugin(InertiaPlugin);
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });
}

start();

export { gsap, Draggable, ScrollTrigger, SplitText };
export { useGSAP } from "@gsap/react";

export default gsap;
