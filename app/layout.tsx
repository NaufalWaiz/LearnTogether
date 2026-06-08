import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LearnTogether AI",
  description:
    "Platform e-learning kolaboratif berbasis AI untuk team matching, project learning, progress feedback, dan portfolio otomatis."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className={`${inter.variable} ${jakarta.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
