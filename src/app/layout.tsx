import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Exit Capsule Agent — Zero-Hallucination Dependency Analysis & AI Modernization",
  description:
    "Perform real AST import mapping, manifest auditing, sandbox Pytest verification, and Gemini AI migration roadmaps — straight from your terminal.",
  keywords: [
    "exit-capsule",
    "Exit Capsule Agent",
    "dependency analysis",
    "AST scanning",
    "pytest verification",
    "Gemini AI",
    "Python modernization",
    "CLI tool",
    "technical debt",
  ],
  authors: [{ name: "Sahil" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Exit Capsule Agent",
    description:
      "Perform real AST import mapping, manifest auditing, sandbox Pytest verification, and Gemini AI migration roadmaps — straight from your terminal.",
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
        className={`${inter.variable} ${jetbrainsMono.variable} bg-[#0d1117] text-[#c9d1d9] antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
