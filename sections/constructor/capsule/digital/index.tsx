"use client";

import Introduction from "@/sections/constructor/capsule/digital/introduction";
import Upload from "@/sections/constructor/capsule/upload";
import Variant from "@/sections/constructor/capsule/variant";
import Message from "@/sections/constructor/capsule/message";
import Recipients from "@/sections/constructor/capsule/digital/recipients";
import Delivery from "@/sections/constructor/capsule/digital/delivery";
import Payment from "@/sections/constructor/capsule/digital/payment";
import { useCapsule, useCapsuleControls } from "@/state/capsule";

export default function Constructor() {
  const { stage } = useCapsule();

  function render() {
    if (!stage) return <Introduction />;

    switch (stage.name) {
      case "upload":
        return <Upload />;
      case "message":
        return <Message />;
      case "variant":
        return <Variant />;
      case "recipients":
        return <Recipients useConstructor={useCapsule} useConstructorControls={useCapsuleControls} />;
      case "delivery":
        return <Delivery />;
      case "payment":
        return <Payment />;
    }
  }

  return render();
}
