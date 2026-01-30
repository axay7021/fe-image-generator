import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/context/auth-context";
import { SubscriptionProvider } from "@/context/subscription-context";
import { Toaster } from "react-hot-toast";
import { FooterWrapper } from "@/components/layout/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev.profilepiclabs.com"),
  title: "ProfilePic Labs",
  description: "Transform your photos with AI",
  keywords: [
    "ProfilePic Labs",
    "ProfilePic",
    "LinkedIn Profile image generator",
    "AI Photo Generator",
    "Linked Profile headshot",
    "Remove Object",
    "Passport Photo",
    "Custom Prompt",
    "Proffesional Photo",
    "Business Photo",
    "AI Photo Generator",
    "4K Photo",
    "Image enhance",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ProfilePic Labs",
    description: "Transform your photos with AI",
    type: "website",
    locale: "en_IN",
    siteName: "ProfilePic Labs",
    images: [
      {
        url: "https://dev.profilepiclabs.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProfilePic Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
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
              <SubscriptionProvider>
                <main className="flex-1">{children}</main>
                <Toaster position="top-center" />
                <FooterWrapper />
              </SubscriptionProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
