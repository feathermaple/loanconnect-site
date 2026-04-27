"use client";

export default function FloatingLine() {
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6">
      <a
        href="https://lin.ee/WPqaDbx"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINE 客服"
        className="
          pointer-events-auto
          flex items-center gap-2
          rounded-full
          bg-[#06C755]
          px-4 py-3
          text-white
          shadow-[0_12px_30px_rgba(6,199,85,0.35)]
          transition-all duration-300
          hover:scale-105 hover:shadow-[0_16px_36px_rgba(6,199,85,0.45)]
          active:scale-95
          sm:px-5
        "
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-6 w-6"
          >
            <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.74 1.55 5.18 3.98 6.8-.15.7-.54 2.44-.62 2.76-.1.42.16.41.34.3.14-.08 2.22-1.5 3.08-2.08 1.02.29 2.1.44 3.22.44 5.52 0 10-3.94 10-8.8S17.52 2 12 2Z" />
          </svg>
        </span>

        <span className="whitespace-nowrap text-base font-black tracking-wide sm:text-lg">
          LINE 客服
        </span>
      </a>
    </div>
  );
}