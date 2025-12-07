import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google"; // Import Merriweather for the "Vibe"
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Recall",
  description: "Reconnecting the dots of a life well-lived.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable, merriweather.variable, "antialiased bg-cream-50 text-stone-900")}>
        {children}
      </body>
    </html>
  );
}
