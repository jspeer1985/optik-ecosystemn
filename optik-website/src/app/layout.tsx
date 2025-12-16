import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from '@/components/WalletProvider';
import '@/lib/wallet-error-suppressor'; // <-- ADD THIS LINE AT TOP
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OPTIK Ecosystem",
  description: "Professional Memecoin Launchpad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " antialiased"}>
        <WalletProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
