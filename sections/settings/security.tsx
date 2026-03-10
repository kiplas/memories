"use client";

import Cancel from "@/icons/cancel";
import FilledKey from "@/icons/filled-key";
import Input from "@/components/input";
import { type MouseEvent, useState } from "react";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { updatePassword } from "@/actions/user";
import { useTRPC } from "@/state/trpc";
import { useQuery } from "@tanstack/react-query";

type EditorProps = {
  onClose: () => unknown;
};

function Editor({ onClose }: EditorProps) {
  const [current, currentError, setCurrent, setCurrentError] = useControlledInput("");
  const [updated, updatedError, setUpdated, setUpdatedError] = useControlledInput("");
  const [confirmation, confirmationError, setConfirmation, setConfirmationError] = useControlledInput("");

  async function update(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentError(null);
    setUpdatedError(null);
    setConfirmationError(null);

    if (current.length < 1) return setCurrentError("Please enter current password");
    if (updated.length < 1) return setUpdatedError("Please enter new password");
    if (confirmation.length < 1) return setConfirmationError("Please confirm new password");
    if (updated !== confirmation) return setConfirmationError("Password doesn't match");

    const { error } = await updatePassword(current, updated);

    if (error === "Password too short") return setUpdatedError("Password too short");
    if (error === "Invalid password") return setCurrentError("Invalid password");

    onClose();
  }

  return (
    <div className="mt-32">
      <hgroup>
        <h3 className="mb-4 font-bold">Cnahge Password</h3>
        <span className="text-space-gray">Enter your current password and choose a new password.</span>
      </hgroup>

      <form className="mx-auto mt-24 max-w-400">
        <div className="flex flex-col gap-y-8">
          <Input
            value={current}
            onChange={({ currentTarget }) => setCurrent(currentTarget.value)}
            error={currentError}
            type="password"
            label="Current Password"
            placeholder="***************"
            name="current password"
            autoComplete="password"
          />

          <Input
            value={updated}
            onChange={({ currentTarget }) => setUpdated(currentTarget.value)}
            error={updatedError}
            type="password"
            label="New Password"
            placeholder="New Password"
            name="new password"
            autoComplete="new password"
          />

          <Input
            value={confirmation}
            onChange={({ currentTarget }) => setConfirmation(currentTarget.value)}
            error={confirmationError}
            type="password"
            label="Confirm new Password"
            placeholder="Confirm new Password"
            name="new password confirmation"
            autoComplete="new password"
          />
        </div>

        <div className="mt-24 flex justify-center gap-x-8">
          <button className="h-36 w-100 cursor-pointer rounded-full bg-[#E2E2E2] text-base text-[0.875rem] text-black" onClick={onClose}>
            Cancel
          </button>

          <button className="bg-green h-36 w-100 cursor-pointer rounded-full text-base text-[0.875rem] text-white" onClick={update}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

type PreviewProps = { edit: () => unknown };

function Preview({ edit }: PreviewProps) {
  return (
    <div className="mt-32 flex flex-col justify-between gap-y-24 md:flex-row md:items-center">
      <div>
        <div className="font-bold">Password</div>
        <div className="text-space-gray mt-4">********************</div>
      </div>

      <button className="bg-blue flex w-fit cursor-pointer items-center justify-center gap-x-4 rounded-full py-8 pr-20 pl-12 text-[0.75rem] font-normal text-white" onClick={edit}>
        <FilledKey />
        Change Password
      </button>
    </div>
  );
}

export default function Security() {
  const [isEditView, setEditView] = useState(false);
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());

  if (!user) throw new Error("Unathorized");

  const { createdAt } = user;

  return (
    <section className="px-16">
      <div className="shadow-widget mx-auto mt-16 max-w-713 rounded-3xl bg-white px-16 py-20 md:px-24">
        <h2 className="text-h3-m md:text-h3-xl">Security</h2>

        {isEditView ? <Editor onClose={() => setEditView(false)} /> : <Preview edit={() => setEditView(true)} />}

        <div className="mt-24 flex flex-col gap-y-24 border-t border-t-black/60 pt-24 md:flex-row md:items-center">
          <div>
            <div className="font-bold">Account</div>
            <div className="text-space-gray mt-4">Active since {createdAt.toLocaleDateString("en-US").replaceAll("/", ".")}</div>
          </div>

          <button className="bg-space-gray flex w-fit cursor-pointer items-center gap-x-4 rounded-full py-8 pr-20 pl-12 text-white md:ml-auto">
            <Cancel /> Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}
