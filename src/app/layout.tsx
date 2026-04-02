import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.site_title || "Corey McCullough | Motorsport Racer",
    description: settings.meta_description || "Official website of Corey McCullough — professional motorsport racer pushing the limits of speed, precision, and performance.",
    openGraph: {
      title: settings.site_title || "Corey McCullough | Motorsport Racer",
      description: settings.meta_description || "Official website of Corey McCullough — professional motorsport racer pushing the limits of speed, precision, and performance.",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const themeColor = settings.theme_primary_color || "#2a6dc7";

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href={settings.favicon_url || "/favicon.ico"} />
        <meta name="theme-color" content={themeColor} />
      </head>
      <body className="min-h-full bg-[#030303] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
