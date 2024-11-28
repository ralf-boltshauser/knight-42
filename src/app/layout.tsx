import { CmdK } from "@/features/cmd-k/cmd-k";
import { EasterEggProvider } from "@/features/easter-eggs/easter-egg-context";
import { authOptions } from "@/lib/auth/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KNIGHT 42",
  description: "Knowledge Network for Incident Gathering, Hosts, and Tracking",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EasterEggProvider>
          <Providers session={session}>
            {children}
            <CmdK />
          </Providers>
        </EasterEggProvider>
        <Toaster />
      </body>
    </html>
  );
}
