import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

//Note: Font style
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

//Note: For SEO
export const metadata: Metadata = {
  title: "Tin Coffee & Eatery",
  description: "A warm corner of Phnom Penh. Open daily in Sen Sok.",
};

//Purpose: Layout is for elements shared across multiple pages, such as Navbar, Footer, etc
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        <Navbar />
        {/* Note: Children is the content from Page.tsx, Next.js automatically */}
        <main className="flex-1">{children}</main>
        <Footer />{" "}
      </body>
    </html>
  );
}
