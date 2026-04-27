"use client";

export default function FloatingLine() {
  return (
    <a
      href="https://lin.ee/WPqaDbx"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LINE客服"
      className="
        fixed bottom-5 right-4 z-[999]
        flex items-center gap-2
        rounded-full bg-[#06C755]
        px-4 py-3 text-white
        shadow-[0_10px_25px_rgba(6,199,85,0.35)]
        transition-all duration-300
        hover:-translate-y-1 hover:scale-105 hover:shadow-[0_14px_32px_rgba(6,199,85,0.45)]
        active:scale-95

        md:bottom-6 md:right-6
      "
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="relative h-5 w-5"
        >
          <path d="M12 2C6.48 2 2 5.94 2 10.5c0 2.63 1.61 4.97 4.11 6.51-.18.66-.66 2.4-.76 2.78-.12.45.17.44.36.32.15-.09 2.38-1.61 3.34-2.27.94.13 1.93.2 2.95.2 5.52 0 10-3.94 10-8.79S17.52 2 12 2Z" />
        </svg>
      </span>

      <span className="text-sm font-bold tracking-wide">LINE客服</span>
    </a>
  );
}