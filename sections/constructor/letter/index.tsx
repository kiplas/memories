"use client";

import Introduction from "@/sections/constructor/letter/introduction";
import Message from "@/sections/constructor/letter/message";
import Variant from "@/sections/constructor/letter/variant";
import Recepients from "@/sections/constructor/letter/recipients";
import Delivery from "@/sections/constructor/letter/delivery";
import Payment from "@/sections/constructor/letter/payment";
import { useLetter, useLetterControls } from "@/state/letter";

export default function Constructor() {
  const { stage } = useLetter();

  function render() {
    if (!stage) return <Introduction />;

    switch (stage.name) {
      case "message":
        return <Message />;
      case "variant":
        return <Variant />;
      case "recipients":
        return <Recepients useConstructor={useLetter} useConstructorControls={useLetterControls} />;
      case "delivery":
        return <Delivery />;
      case "payment":
        return <Payment />;
    }
  }

  return render();
}
