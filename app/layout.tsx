import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamMatch — Find Your Perfect Match",
  description: "Connect with like-minded people through live streaming, meaningful conversations, and authentic connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased`}
      >
      <AuthProvider>
        <div className="h-full flex flex-col">
          <Navbar />
          {children}
        </div>
      
      </AuthProvider>
        
      </body>
    </html>
  );
}
