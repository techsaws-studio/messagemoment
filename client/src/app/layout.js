import ChatContextProvider from "@/contexts/chat-context";
import { SocketProvider } from "@/contexts/socket-context";

import "../../public/styles/main.scss";

export const metadata = {
  title: "MessageMoment – Your Message Only Lasts a Moment",
  description:
    "MessageMoment is a secure, private, and temporary chat platform. Share conversations with trusted friends that disappear after the moment passes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta
          name="title"
          content="MessageMoment – Your Message Only Lasts a Moment"
        />
        <meta
          name="description"
          content="MessageMoment is a secure, private, and temporary chat platform. Share conversations with trusted friends that disappear after the moment passes."
        />

        <meta name="application-name" content="MessageMoment" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MessageMoment" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="MessageMoment – Your Message Only Lasts a Moment"
        />
        <meta
          property="og:description"
          content="MessageMoment is a secure, private, and temporary chat platform. Share conversations with trusted friends that disappear after the moment passes."
        />
        <meta
          property="og:url"
          content="https://message-moment-app.vercel.app"
        />
        <meta
          property="og:image"
          content="https://message-moment-app.vercel.app/android-chrome-512x512.png"
        />
        <meta property="og:site_name" content="MessageMoment" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta
          name="twitter:image"
          content="https://message-moment-app.vercel.app/android-chrome-512x512.png"
        />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
      </head>
      <body>
        <ChatContextProvider>
          <SocketProvider>{children}</SocketProvider>
        </ChatContextProvider>
      </body>
    </html>
  );
}
