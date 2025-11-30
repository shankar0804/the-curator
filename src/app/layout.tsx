import type { Metadata } from "next";
import { Syncopate, Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-syncopate" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument-serif", style: "italic" });

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
      <body className={`${syncopate.variable} ${manrope.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
