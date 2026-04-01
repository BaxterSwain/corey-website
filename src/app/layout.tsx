import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corey McCullough | Motorsport Racer",
  description:
    "Official website of Corey McCullough — professional motorsport racer pushing the limits of speed, precision, and performance.",
  openGraph: {
    title: "Corey McCullough | Motorsport Racer",
    description:
      "Official website of Corey McCullough — professional motorsport racer pushing the limits of speed, precision, and performance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#030303] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
