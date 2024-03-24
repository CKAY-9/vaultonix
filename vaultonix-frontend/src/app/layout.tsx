import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Vaultonix",
  description: "A Very Fun and Rewarding Discord Bot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
