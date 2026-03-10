import CloudUpload from "@/icons/cloud-uplopad";
import LocalDownload from "@/icons/local-download";
import Lock from "@/icons/Lock";
import MailVerified from "@/icons/mail-verified";

const list = [
  {
    name: "Private-by-design encryption",
    summary: "Your letters and photos are locked with digital keys. Only you and the chosen person can open them.",
    Icon: Lock,
  },
  {
    name: "Secure media storage with backups",
    summary: "All memories are stored safely on protected servers, with copies saved just in case.",
    Icon: CloudUpload,
  },
  {
    name: "Verified print partners & tracked shipping",
    summary: "Your letters and photos are locked with digital keys. Only you and the chosen person can open them.",
    Icon: MailVerified,
  },
  {
    name: "GDPR-ready, data export anytime",
    summary: "You can download or delete all your data whenever you want.",
    Icon: LocalDownload,
  },
];

export default function Security() {
  return (
    <div className="relative z-1 bg-white py-64">
      <hgroup className="px-32 text-center">
        <h2 className="text-h1-m md:text-h1-xl">
          Your Memories Are <em className="text-green not-italic">Safe</em>
        </h2>
        <span className="text-accent-xl mt-24 block">Private, secure, and always under your control.</span>
      </hgroup>

      <div className="scrollbar-none mx-auto mt-55 grid max-w-(--w-viewport) grid-cols-[repeat(4,minmax(338px,1fr))] gap-8 overflow-auto px-32 md:mt-64 md:gap-20 md:px-40">
        {list.map(({ name, summary, Icon }) => (
          <div className="min-h-220 rounded-3xl border border-solid border-[#BBBBBB] p-24 pt-16" key={name}>
            <Icon className="size-48 md:size-64" />
            <span className="mt-21 block text-[1.125rem] font-semibold -tracking-tighter md:text-[1.5rem]/[1.5625rem]">{name}</span>
            <span className="mt-16 block text-[0.875rem] font-medium -tracking-tighter md:mt-30 md:text-[1rem]">{summary}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
