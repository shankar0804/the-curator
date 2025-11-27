import type { Metadata } from "next";
import { Inter, Roboto_Mono, Syncopate, Italiana, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });
const syncopate = Syncopate({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-syncopate" });
const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-italiana" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "The Curator",
  description: "Effortless style, curated for the modern man",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} ${syncopate.variable} ${italiana.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
