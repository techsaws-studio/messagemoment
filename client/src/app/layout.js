import ChatContextProvider from "@/contexts/chat-context";
import { SocketProvider } from "@/contexts/socket-context";

import SideCookieModal from "@/components/home/sideCookieModal";

import "../../public/styles/main.scss";

const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://messagemoment.com";

export const metadata = {
  title: "MessageMoment – Your Message Only Lasts a Moment",
  description:
    "MessageMoment is a secure, private, and temporary real-time chat platform. Share conversations with trusted friends that disappear after the moment passes.",
  applicationName: "MessageMoment",
  robots: "index, follow",
  themeColor: "#494af8",
  alternates: {
    canonical: BASE_URL,
  },
  appleWebApp: {
    capable: true,
    title: "MessageMoment",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "MessageMoment – Your Message Only Lasts a Moment",
    description:
      "MessageMoment is a secure, private, and temporary real-time chat platform. Share conversations with trusted friends that disappear after the moment passes.",
    siteName: "MessageMoment",
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MessageMoment – Your Message Only Lasts a Moment",
    description:
      "MessageMoment is a secure, private, and temporary real-time chat platform. Share conversations with trusted friends that disappear after the moment passes.",
    images: [`${BASE_URL}/android-chrome-512x512.png`],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChatContextProvider>
          <SocketProvider>
            {children}
            <SideCookieModal />
          </SocketProvider>
        </ChatContextProvider>
      </body>
    </html>
  );
}
