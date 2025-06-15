import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextThemeProvider } from "@/providers/next-theme-provider";

// STYLE SHEETS SOURCES
import "./globals.css";
import "../styles/includes.css";
import "../../node_modules/flag-icons/css/flag-icons.min.css";

// FONT CONFIGURATIONS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

// WEBSITE METADATA AND VIEWPORT
export const metadata: Metadata = {
  title: "MessageMoment - The real meaning to personal!",
  description: "MessageMoment - The real meaning to personal!",
  creator: "Sag3 Tech",
  applicationName: "MessageMoment",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/favicon.ico",
      },
      {
        rel: "shortcut icon",
        url: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        cz-shortcut-listen="true"
        className={`${inter.variable} ${jetbrains_mono.variable} antialiased`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
