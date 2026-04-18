import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Mono, Syne } from "next/font/google";
import Script from "next/script";
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
  title: "HiredByAgents — Human fallback API for AI agents",
  description:
    "When your AI agent hits a task it can't complete, we route it to a human and return structured results via API.",
  metadataBase: new URL("https://hiredbyagents.com"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "HiredByAgents — Human fallback API for AI agents",
    description:
      "When your AI agent hits a task it can't complete, we route it to a human and return structured results via API.",
    url: "https://hiredbyagents.com",
    siteName: "HiredByAgents",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HiredByAgents — Human fallback API for AI agents",
    description: "Human fallback layer for AI agents. Real-world verification, returned as JSON.",
  },
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
        <Script
          id="clarity-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wdbbx4zqd3");`,
          }}
        />
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
