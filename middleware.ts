import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
 * Redirects requests under `/workspace` to the organization-specific workspace path when the session's `org_code` claim is not present in the request path.
 *
 * @returns A `NextResponse` that redirects to `/workspace/{org_code}` if the path starts with `/workspace` and does not include the organization code; `NextResponse.next()` otherwise.
 */
async function existingMiddleware(req: NextRequest) {
  const { getClaim } = getKindeServerSession();

  const orgCode = await getClaim("org_code");

  const url = req.nextUrl;

  if (
    url.pathname.startsWith("/workspace") &&
    !url.pathname.includes(orgCode?.value || "")
  ) {
    url.pathname = `/workspace/${orgCode?.value}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default createMiddleware(aj, existingMiddleware);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|/rpc).*)"],
};