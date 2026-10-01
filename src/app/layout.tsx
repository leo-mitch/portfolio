import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import { Particles } from "@/components/particles";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.flipSentences[0]}`,
  description: profile.about[0],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <noscript>
          <style>{`[data-intro],[data-intro-title],[data-scramble],[data-typewriter],[data-split],[data-reveal]{visibility:visible!important}`}</style>
        </noscript>
        <Particles />
        {children}
      </body>
    </html>
  );
}
