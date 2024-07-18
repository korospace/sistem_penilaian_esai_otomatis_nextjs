// next
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// external lib
import { Toaster } from "react-hot-toast";
// assets
import "@/assets/css/globals.css";
import BudiluhurJpg from "@/assets/images/budiluhur.jpg";
// provider
import {
  NextAuthProvider,
  NextProgressBarProvider,
  NextUiProvider,
} from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
  icons: {
    icon: BudiluhurJpg.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <NextUiProvider>
          <NextAuthProvider>
            <NextProgressBarProvider>
              {children}
              <Toaster position="top-right" />
            </NextProgressBarProvider>
          </NextAuthProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
