import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exit Capsule Agent — Zero-Hallucination Dependency Analysis & AI Modernization",
  description:
    "Perform real AST import mapping, manifest auditing, sandbox Pytest verification, and Gemini AI migration roadmaps — straight from your terminal.",
  keywords: [
    "exit-capsule",
    "dependency analysis",
    "AST scanning",
    "pytest verification",
    "Gemini AI",
    "Python modernization",
    "CLI tool",
    "technical debt",
  ],
  authors: [{ name: "exitkit" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Exit Capsule Agent",
    description:
      "Zero-hallucination dependency analysis & AI modernization — real AST import mapping, sandbox Pytest verification, and Gemini AI migration roadmaps from your terminal.",
    siteName: "Exit Capsule Agent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exit Capsule Agent",
    description:
      "Zero-hallucination dependency analysis & AI modernization — straight from your terminal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0D1117] text-slate-200 antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
