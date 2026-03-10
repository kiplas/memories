"use client";

import Introduction from "@/sections/constructor/capsule/printed/introduction";
import Upload from "@/sections/constructor/capsule/upload";
import Variant from "@/sections/constructor/capsule/variant";
import Message from "@/sections/constructor/capsule/message";
import Recipients from "@/sections/constructor/capsule/printed/recipients";
import Delivery from "@/sections/constructor/capsule/printed/delivery";
import Payment from "@/sections/constructor/capsule/printed/payment";
import { useCapsule } from "@/state/capsule";

export default function Constructor() {
  const { stage } = useCapsule();

  function render() {
    if (!stage) return <Introduction />;

    switch (stage.name) {
      case "upload":
        return <Upload />;
      case "variant":
        return <Variant resizable />;
      case "message":
        return <Message />;
      case "recipients":
        return <Recipients />;
      case "delivery":
        return <Delivery />;
      case "payment":
        return <Payment />;
    }
  }
  return render();
}
