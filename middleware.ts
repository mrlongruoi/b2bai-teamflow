import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
        "CATEGORY:WEBHOOK",
      ],
    }),
  ],
});

/**
 * Ensures requests to "/workspace" are scoped to the authenticated user's organization by redirecting to "/workspace/{orgCode}" when needed.
 *
 * @param req - The incoming NextRequest, which may be augmented with `kindeAuth` (`user` and/or `token`) containing `org_code`.
 * @returns A NextResponse that redirects to `/workspace/{orgCode}` when the current path starts with `/workspace` but does not include the derived org code, otherwise a regular `NextResponse.next()`.
 */
async function existingMiddleware(req: NextRequest) {
  const anyReq = req as {
    nextUrl: NextRequest["nextUrl"];
    kindeAuth?: {
      token?: any;
      user?: any;
    };
  };

  const url = req.nextUrl;

  const orgCode =
    anyReq.kindeAuth?.user?.org_code ||
    anyReq.kindeAuth?.token?.org_code ||
    anyReq.kindeAuth?.token?.claims?.org_code;

  if (
    url.pathname.startsWith("/workspace") &&
    !url.pathname.includes(orgCode || "")
  ) {
    url.pathname = `/workspace/${orgCode}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default createMiddleware(
  aj,
  withAuth(existingMiddleware, {
    publicPaths: ["/"],
  }) as NextMiddleware
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|/rpc).*)"],
};