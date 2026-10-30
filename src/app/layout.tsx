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
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#f5f3ed] text-[#21332e]`}>
          <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
            <p className="text-sm uppercase tracking-widest">AI Image Generator</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">The application is hosted.<br />Sign-in setup is pending.</h1>
            <p className="max-w-xl text-lg leading-relaxed">Image uploads and generation will become available once the owner finishes authentication and AI service configuration.</p>
            <p role="status" className="rounded-xl border border-[#cbd5c7] bg-white p-5">Live image generation is currently unavailable. No sample output is presented as a generated result.</p>
            <div className="flex flex-wrap gap-5">
              <a className="underline" href="https://www.akshaydobariya.dev/projects/ai-image-generator">Project overview</a>
              <a className="underline" href="https://github.com/axay7021/fe-image-generator">Frontend source</a>
              <a className="underline" href="https://github.com/axay7021/be-image-generator">Backend source</a>
            </div>
          </main>
        </body>
      </html>
    );
  }
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
