import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlowContainer } from "./components/GlowContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Todo App",
  description: "A minimalistic, modern to-do list app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <GlowContainer />
        {children}
      </body>
    </html>
  );
}
