import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarLight Quran",
  description: "قارئ القرآن الكريم - وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
  keywords: "قرآن, quran, دعاء, duas, أذكار, adhkar, أوقات الصلاة, prayer times, islamic app",
  authors: [{ name: "StarLight Team" }],
  creator: "StarLight",
  publisher: "StarLight",
  metadataBase: new URL("https://starlight-quran.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StarLight Quran",
    description: "قارئ القرآن الكريم - وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "StarLight Quran",
    description: "قارئ القرآن الكريم - وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}