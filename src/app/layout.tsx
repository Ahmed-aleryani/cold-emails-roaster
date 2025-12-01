import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cold Email Roaster - Roast First, Fix Second",
  description:
    "Get brutally honest critique of your cold emails, an improved version, and learn why it's better. Roast first, fix second.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
