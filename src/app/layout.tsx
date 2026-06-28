import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GovFlow AI — Government Services Made Simple",
  description:
    "AI Government Copilot for Ghana. Turn confusing government procedures into clear step-by-step workflows.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/govflow-mark.svg",
    shortcut: "/govflow-mark.svg",
    apple: "/govflow-mark.svg",
  },
  appleWebApp: {
    capable: true,
    title: "GovFlow",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased font-sans">
        {children}
        <PwaInstallPrompt />
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
