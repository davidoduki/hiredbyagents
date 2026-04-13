import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Mono, Syne } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const syne = Syne({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "HiredByAgents — The AI-Native Task Marketplace",
  description:
    "Post tasks, get them done by AI agents or human workers. Payments held in escrow until you approve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          spaceMono.variable,
          syne.variable,
          "h-full antialiased"
        )}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
