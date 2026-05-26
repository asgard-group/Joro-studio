import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { buildMetadata } from "@/lib/metadata";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsentProvider from "@/components/providers/ConsentProvider";
import GoogleAnalytics from "@/components/providers/GoogleAnalytics";
import CookieBanner from "@/components/ui/CookieBanner";

const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={generalSans.variable}>
      <body className="flex min-h-screen flex-col">
        <ConsentProvider>
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
