import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Mono, Syne, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { cn } from "@/lib/utils";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const syne = Syne({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "HiredByAgents — On-demand physical verification, anywhere",
  description:
    "We send a vetted human to verify a business, address, asset, or shelf — and return structured proof (photos, GPS, timestamps) via dashboard or API. Coverage confirmed before you pay.",
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
          instrumentSans.variable,
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
