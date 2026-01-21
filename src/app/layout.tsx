import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Photo Generator",
  description: "Transform your photos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <ReactQueryProvider>
            <AuthProvider>
              <main className="flex-1">{children}</main>
              <Toaster position="top-center" />
              <Footer />
            </AuthProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
