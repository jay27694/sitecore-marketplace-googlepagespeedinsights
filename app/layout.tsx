import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/providers";

export const metadata: Metadata = {
  title: "Sitecore Marketplace App - Google PageSpeed Insights Analysis",
  description: "A Sitecore Marketplace App to analyze Google PageSpeed Insights for the current page in Page builder. It uses OpenAI APIs to generate clear recommendations for further Performance and SEO improvements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
