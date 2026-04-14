import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminEntryButton from "@/components/AdminEntryButton";
import { GoogleTagManager } from "@next/third-parties/google";
import MobileCTA from "@/components/MobileCTA";
import FloatingLine from "@/components/FloatingLine";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://秒貸通-site.vercel.app"),

  title: {
    default: "秒貸通｜貸款評估、信用貸款、整合負債媒合平台",
    template: "%s｜秒貸通",
  },

  description:
    "秒貸通 提供信用貸款、整合負債、小額借款與貸款需求評估服務，快速填表、專人聯繫，協助你找到合適方案。",

  keywords: [
    "貸款",
    "信用貸款",
    "整合負債",
    "小額貸款",
    "借款評估",
    "貸款平台",
    "貸款媒合",
    "秒貸通",
  ],

  authors: [{ name: "秒貸通" }],
  creator: "秒貸通",
  publisher: "秒貸通",

  openGraph: {
    title: "秒貸通｜貸款評估、信用貸款、整合負債媒合平台",
    description:
      "快速填表、專人聯繫，協助你找到合適的信用貸款、整合負債與小額借款方案。",
    url: "https://秒貸通-site.vercel.app",
    siteName: "秒貸通",
    locale: "zh_TW",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "秒貸通｜貸款評估、信用貸款、整合負債媒合平台",
    description:
      "快速填表、專人聯繫，協助你找到合適的信用貸款、整合負債與小額借款方案。",
  },

  alternates: {
    canonical: "https://秒貸通-site.vercel.app",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="6GAJmOE_9Da5hLgAi6oa73iDM2f0BYhYInupwi7ORZU"
        />
      </head>

      <body className="bg-[#f6f2ec] text-[#2f2a25]">
        <GoogleTagManager gtmId="GTM-MFLZMWPV" />
        <Navbar />
        {children}
        <AdminEntryButton />
        <Footer />
        <MobileCTA />
        <FloatingLine />
        <SpeedInsights />
      </body>
    </html>
  );
}