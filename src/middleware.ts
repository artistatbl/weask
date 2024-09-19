import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

function sessionMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const cookie = req.cookies.get("sessionId");
  if (!cookie) {
    res.cookies.set("sessionId", crypto.randomUUID());
  }
  return res;
}

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
  return sessionMiddleware(request);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};