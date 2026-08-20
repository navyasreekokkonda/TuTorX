import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/demo(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",

  // course browsing
  "/course(.*)",
  "/api/course(.*)",
  "/api/generate-course(.*)",

  // allow reading progress (resume feature)
  "/api/progress(.*)",
  "/api/progress/topic(.*)",

  // allow guest demo AI & Notebook interactions
  "/notebook(.*)",
  "/dashboard(.*)",
  "/analytics(.*)",
  "/api/notebook/chat(.*)",
  "/api/ai/generate-problems(.*)",
  "/api/ai/sessions(.*)",
  "/api/goals(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
