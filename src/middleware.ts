import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/', // Protect the dashboard
  '/user-profile(.*)',
  '/upi-reconciliation(.*)',
  '/whatsapp-automation(.*)',
  '/gst-invoicing(.*)',
  '/communication-preferences(.*)',
  '/features(.*)',
  '/pricing(.*)', // Might be public, but an authenticated user experience could be different
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
