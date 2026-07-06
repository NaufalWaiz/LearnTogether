import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";

const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
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
        <body className={`${dmsans.variable} ${poppins.variable} font-sans bg-[#FFF5F1]`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
