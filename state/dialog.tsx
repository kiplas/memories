"use client";

import { type PropsWithChildren, useState, createContext, use } from "react";

type CapsulePopUpDialog = {
  name: "capsule-popup";
};

type DemoDialog = {
  name: "demo";
};

type Dialog = CapsulePopUpDialog | DemoDialog;

type DialogContext = {
  list: Dialog[];
};

const DialogContext = createContext<DialogContext | null>(null);

type DialogControlContext = {
  open: (modal: Dialog) => unknown;
  close: (modal: Dialog) => unknown;
};

const DialogControlContext = createContext<DialogControlContext | null>(null);

export function Provider({ children }: PropsWithChildren) {
  const [list, setList] = useState<Dialog[]>([]);

  const context = {
    list,
  };

  function open(dialog: Dialog) {
    if (list.some(({ name }) => name === dialog.name)) return;

    setList([...list, dialog]);
  }

  function close(dialog: Dialog) {
    setList(list.filter(({ name }) => name !== dialog.name));
  }

  const controls = {
    open,
    close,
  };

  return (
    <DialogContext value={context}>
      <DialogControlContext value={controls}>{children}</DialogControlContext>
    </DialogContext>
  );
}

export function useDialog() {
  const context = use(DialogContext);

  if (!context) throw new Error("Unable to access modal context outside of provider");

  return context;
}

export function useDialogControls() {
  const context = use(DialogControlContext);

  if (!context) throw new Error("Unable to access modal controls context outside of provider");

  return context;
}
