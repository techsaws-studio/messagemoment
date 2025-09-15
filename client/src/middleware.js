import { NextResponse } from "next/server";

import { ApiRequest } from "@/utils/api-request";

export async function middleware(req) {
  try {
    const url = new URL(req.nextUrl);
    const pathname = url.pathname;

    const sessionIdMatch = pathname.match(/^\/chat\/([^/]+)$/);
    if (sessionIdMatch) {
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
    }

    if (pathname === "/locked-session" || pathname === "/expired-session") {
      const sessionId = url.searchParams.get("sessionId");

      if (!sessionId) {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
      }

      const cacheBuster = Date.now();
      const response = await ApiRequest(
        `/validate-session/${sessionId}?t=${cacheBuster}`
      );

      if (!response) {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
      }

      if (response.success) {
        return NextResponse.redirect(
          new URL(`/chat/${sessionId}`, req.nextUrl.origin)
        );
      }

      const expectedRedirect = response.redirect?.replace(
        `?sessionId=${sessionId}`,
        ""
      );

      if (
        pathname === "/locked-session" &&
        expectedRedirect !== "/locked-session"
      ) {
        return NextResponse.redirect(
          new URL(`/expired-session?sessionId=${sessionId}`, req.nextUrl.origin)
        );
      }

      if (
        pathname === "/expired-session" &&
        expectedRedirect !== "/expired-session"
      ) {
        return NextResponse.redirect(
          new URL(`/locked-session?sessionId=${sessionId}`, req.nextUrl.origin)
        );
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/chat/:sessionId*", "/locked-session", "/expired-session"],
};
