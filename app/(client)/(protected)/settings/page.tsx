import { CompressedHeader } from "@/components/header";
import SignoutButton from "@/components/signout-button";
import Information from "@/sections/settings/information";
import Security from "@/sections/settings/security";
import Transactions from "@/sections/settings/transactions";

export default function Settings() {
  return (
    <>
      <div className="bg-account-gray min-h-svh pt-120 pb-200">
        <CompressedHeader />

        <h1 className="text-h2-m md:text-h2-xl text-center">Profile settings</h1>

        <Information />
        <Security />
        <Transactions />

        <SignoutButton />
      </div>
    </>
  );
}
