// nextjs
import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactoryType } from "../types/ResultTypes";
// helpers
import { pathCheck } from "../helpers/helpers";

/**
 * MIDDLEWARE PATH
 * ----------------------------
 */
const authPage: string[] = ["/login"];
const noCallbackUrl: string[] = ["/logout", "/notfound"];
const examPage: string[] = ["/dashboard/exam/create", "/dashboard/exam/update"];
const adminPage: string[] = [
  "/dashboard/admin",
  "/dashboard/teacher",
  "/dashboard/student",
  "/dashboard/courses",
];
const requiredPath: string[] = [
  "/",
  "/exam",
  "/dashboard",
  "/dashboard/exam",
  "/dashboard/profile",
  ...authPage,
  ...noCallbackUrl,
  ...examPage,
  ...adminPage,
];

/**
 * MIDDLEWARE RULES
 * ----------------------------
 */
const PageMiddleware: MiddlewareFactoryType = (middleware: NextMiddleware) => {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (pathCheck(pathname, requiredPath)) {
      const token = await getToken({
        req,
        secret: process.env.APP_KEY,
      });

      // redirect to main page (login)
      if (pathname == "/") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // redirect to dashboard if loggedin
      if (token && authPage.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // protect all page except login
      if (!token && !authPage.includes(pathname)) {
        const url = new URL("/login", req.url);

        if (!noCallbackUrl.includes(pathname)) {
          url.searchParams.set("callbackUrl", encodeURI(req.url));
        }

        return NextResponse.redirect(url);
      }

      if (token) {
        // only admin
        if (pathCheck(pathname, adminPage) && token?.id_user_role !== 1) {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
        // exam page
        if (
          pathCheck(pathname, examPage) &&
          token?.id_user_role !== 1 &&
          token?.id_user_role !== 2
        ) {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      }
    }

    return middleware(req, next);
  };
};

export default PageMiddleware;
