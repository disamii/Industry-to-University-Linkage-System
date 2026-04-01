import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    template: "%s | University Industry Linkage Platform",
    default: "University Industry Linkage Platform",
  },
  description:
    "Connect universities with industry partners to collaborate on research, innovation, internships, and real-world problem solving.",
  icons: {
    icon: "/favicon/favicon.ico", // Standard favicon
    shortcut: "/favicon/favicon-32x32.png",
    apple: "/favicon/apple-touch-icon.png", // For iOS home screen
  },
  manifest: "/site.webmanifest", // For PWA support
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className}  antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
