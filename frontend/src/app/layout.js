import "./globals.css";
import { Inter } from "next/font/google";

import Image from "next/image";

import logoImg from "../public/logo.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Net Scan",
  description: "Net Scan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="shadow-sm">
          <div className="mx-auto max-w-screen-xl py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Image
                className="w-32 sm:w-36"
                alt="logo"
                src={logoImg}
                priority
              />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
