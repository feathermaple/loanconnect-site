import Link from "next/link";

export default function AdminEntryButton() {
  return (
    <Link
      href="/admin/login"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center rounded-full border border-[#d8cec2] bg-white/95 px-4 py-2 text-sm font-semibold text-[#3e3a34] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#f8f5ef]"
    >
      後台登入
    </Link>
  );
}