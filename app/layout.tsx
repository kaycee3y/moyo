import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
    subsets: ["latin"],
    });

    export const metadata: Metadata = {
      title: "MOYO — A companion for your everyday",
        description: "A thoughtful AI wellness companion for everyday life.",
        };

        export default function RootLayout({
          children,
          }: Readonly<{
            children: React.ReactNode;
            }>) {
              return (
                  <html lang="en">
                        <body className={`${inter.variable} antialiased`}>
                                {children}
                                      </body>
                                          </html>
                                            );
                                            }