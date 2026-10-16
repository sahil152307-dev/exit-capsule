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
  title: "ExitKit — Automated Dependency Resilience & Safe Migrations for Open Source",
  description:
    "Scan your repository, detect risky dependencies, run automated verification tests, and generate verified Dependency Exit Capsules in seconds.",
  keywords: [
    "exit-capsule",
    "ExitKit",
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
    title: "ExitKit — Automated Dependency Resilience",
    description:
      "Scan your repository, detect risky dependencies, run automated verification tests, and generate verified Dependency Exit Capsules in seconds.",
    siteName: "ExitKit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExitKit — Automated Dependency Resilience",
    description:
      "Automated dependency resilience and safe migrations for open source.",
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
