import { NextResponse } from "next/server";
import { ApiRequest } from "@/utils/api-request";

const sessionCache = new Map();
const CACHE_TTL = 2 * 60 * 1000;

async function validateSessionWithCache(sessionId) {
  const now = Date.now();
  const cached = sessionCache.get(sessionId);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`📄 Cache hit for session: ${sessionId}`);
    return cached.result;
  }

  try {
    const response = await ApiRequest(
      `/api/v1/controller/validate-session/${sessionId}`
    );

    const ttl = response?.success ? CACHE_TTL : CACHE_TTL / 4;
    sessionCache.set(sessionId, {
      result: response,
      timestamp: now,
      ttl,
    });

    return response;
  } catch (error) {
    console.error(`🔥 API call failed for session ${sessionId}:`, error);

    return {
      success: false,
      redirect: "/expired-session",
      message: `API Error: ${error.message}`,
      error: true,
      errorType: error.type || "API_ERROR",
    };
  }
}

export async function middleware(req) {
  try {
    const url = new URL(req.nextUrl);
    const pathname = url.pathname;

    const sessionIdMatch = pathname.match(/^\/chat\/([^/]+)$/);
    if (!sessionIdMatch) {
      return NextResponse.next();
    }

    const sessionId = sessionIdMatch[1];

    if (
      !sessionId ||
      sessionId.length > 100 ||
      !/^[a-zA-Z0-9-_]+$/.test(sessionId)
    ) {
      console.warn(`🚨 Invalid session ID format: ${sessionId}`);
      return NextResponse.redirect(
        new URL("/error?reason=invalid-session", req.nextUrl.origin)
      );
    }

    console.log(`🔍 Validating session: ${sessionId}`);

    const response = await validateSessionWithCache(sessionId);

    if (!response || typeof response.success !== "boolean") {
      console.error(`💥 Invalid API response for ${sessionId}:`, response);

      return NextResponse.redirect(
        new URL(
          `/expired-session?sessionId=${encodeURIComponent(
            sessionId
          )}&reason=invalid-response`,
          req.nextUrl.origin
        )
      );
    }

    if (response.error === true) {
      console.error(
        `🚨 API Error for session ${sessionId}: ${response.message}`
      );

      const errorReason =
        response.errorType === "NETWORK_ERROR" ? "network-error" : "api-error";
      return NextResponse.redirect(
        new URL(
          `/expired-session?sessionId=${encodeURIComponent(
            sessionId
          )}&reason=${errorReason}`,
          req.nextUrl.origin
        )
      );
    }

    if (response.success === true) {
      console.log(`✅ Session validation successful: ${sessionId}`);

      const successResponse = NextResponse.next();
      successResponse.headers.set("x-session-id", sessionId);
      successResponse.headers.set("x-session-valid", "true");

      return successResponse;
    }

    console.log(
      `⚠️ Session validation failed: ${sessionId}, redirecting to: ${response.redirect}`
    );

    let redirectUrl = response.redirect || "/expired-session";

    switch (redirectUrl) {
      case "/expired-session":
        redirectUrl = `/expired-session?sessionId=${encodeURIComponent(
          sessionId
        )}`;
        break;

      case "/locked-session":
        redirectUrl = `/locked-session?sessionId=${encodeURIComponent(
          sessionId
        )}`;
        break;

      case "/full-session":
        redirectUrl = `/full-session?sessionId=${encodeURIComponent(
          sessionId
        )}`;
        break;

      default:
        const hasQuery = redirectUrl.includes("?");
        redirectUrl = `${redirectUrl}${
          hasQuery ? "&" : "?"
        }sessionId=${encodeURIComponent(sessionId)}`;
    }

    const redirectResponse = NextResponse.redirect(
      new URL(redirectUrl, req.nextUrl.origin)
    );

    if (process.env.NODE_ENV === "development") {
      redirectResponse.headers.set(
        "x-redirect-reason",
        response.message || "unknown"
      );
      redirectResponse.headers.set("x-original-session", sessionId);
      redirectResponse.headers.set("x-api-success", String(response.success));
    }

    return redirectResponse;
  } catch (error) {
    console.error("🔥 Critical middleware error:", error);

    const sessionIdMatch = req.nextUrl.pathname.match(/^\/chat\/([^/]+)$/);
    const sessionId = sessionIdMatch ? sessionIdMatch[1] : "unknown";

    return NextResponse.redirect(
      new URL(
        `/expired-session?sessionId=${encodeURIComponent(sessionId)}`,
        req.nextUrl.origin
      )
    );
  }
}

export const config = {
  matcher: ["/chat/:sessionId*"],
};

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, value] of sessionCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        sessionCache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0 && process.env.NODE_ENV === "development") {
      console.log(`🧹 Cleaned ${cleanedCount} expired session cache entries`);
    }
  }, 5 * 60 * 1000);
}
