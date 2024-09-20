import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"; // {{ edit_1 }}

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/' ,]);

// export function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   const cookie = req.cookies.get("sessionId");

//   if (!cookie) {
//     res.cookies.set("sessionId", crypto.randomUUID());
//   }

//   return res; // Ensure to return the response after setting the cookie
// }

// {{ edit_2 }} Combine clerkMiddleware with route protection
export default clerkMiddleware( async (auth, req) => {
  if (!auth().userId && !isPublicRoute(req)) {
    console.log("User is not authenticated");
   
    // Protect routes that are not public
    // auth().protect(); 
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};