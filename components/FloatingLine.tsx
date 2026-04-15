"use client";

export default function FloatingLine() {
  return (
    <a
      href="https://lin.ee/WPqaDbx"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-[#06C755] px-4 py-3 text-white shadow-lg transition hover:scale-105 md:bottom-10 md:right-6"
      aria-label="LINE諮詢"
    >
      {/* LINE icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-5 w-5"
      >
        <path d="M12 2C6.48 2 2 5.94 2 10.5c0 2.63 1.61 4.97 4.11 6.51-.18.66-.66 2.4-.76 2.78-.12.46.17.45.36.32.15-.1 2.44-1.6 3.43-2.25.61.1 1.25.15 1.86.15 5.52 0 10-3.94 10-8.5S17.52 2 12 2z" />
      </svg>

      <span className="text-sm font-semibold">LINE諮詢</span>
    </a>
  );
}