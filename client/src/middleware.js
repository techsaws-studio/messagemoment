import { NextResponse } from "next/server";

import { ApiRequest } from "@/utils/api-request";

export async function middleware(req) {
  try {
    const url = new URL(req.nextUrl);
    const pathname = url.pathname;

    const sessionIdMatch = pathname.match(/^\/chat\/([^/]+)$/);
    if (!sessionIdMatch) {
      return NextResponse.next();
    }

    const sessionId = sessionIdMatch[1];

    const cacheBuster = Date.now();
    const response = await ApiRequest(
      `/validate-session/${sessionId}?t=${cacheBuster}`
    );

    if (!response || response.redirect === undefined) {
      throw new Error("Invalid API response structure");
    }

    if (response.success) {
      return NextResponse.next();
    }

    let redirectUrl = response.redirect;
    if (redirectUrl === "/expired-session") {
      redirectUrl = `/expired-session?sessionId=${sessionId}`;
    } else if (redirectUrl === "/locked-session") {
      redirectUrl = `/locked-session?sessionId=${sessionId}`;
    }

    return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin));
  } catch (error) {
    console.error("Middleware Error:", error.message);
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/chat/:sessionId*",
};
