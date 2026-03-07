import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f7f4ef",
        paper: "#fffdf9",
        ink: "#3e3a34",
        muted: "#6b645c",
        line: "#e8e1d8",
        soft: "#f2ede5"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(62,58,52,0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
