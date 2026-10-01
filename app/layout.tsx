import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import UvaSidebar from "@/components/UvaSidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hunter | UvA AI Chat",
  description: "Find the mistake in AI-generated statements and sharpen your understanding of Physics 101.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UvaSidebar />
        <div className="uva-workspace">{children}</div>
      </body>
    </html>
  );
}
