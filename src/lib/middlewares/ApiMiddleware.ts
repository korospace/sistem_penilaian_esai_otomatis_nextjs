// nextjs
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
// helpers
import { ResponseFormating, pathCheck } from "../helpers/helpers";
// types
import { MiddlewareFactoryType } from "../types/ResultTypes";

/**
 * MIDDLEWARE PATH
 * ----------------------------
 */
const examApi: string[] = [
  "/api/exam/create",
  "/api/exam/update",
  "/api/exam/delete",
  "/api/exam/member/create",
  "/api/exam/member/delete",
  "/api/exam/question/create",
  "/api/exam/question/update",
  "/api/exam/question/delete",
];
const adminApi: string[] = [
  "/api/admin",
  "/api/teacher",
  "/api/student",
  "/api/courses/create",
  "/api/courses/update",
  "/api/courses/delete",
];
const requiredPath: string[] = [
  "/api/courses",
  "/api/profile",
  "/api/exam",
  "/api/exam/member/status",
  "/api/exam/answer",
  "/api/exam/result",
  "/api/autocomplete",
  ...examApi,
  ...adminApi,
];

/**
 * MIDDLEWARE RULES
 * ----------------------------
 */
const ApiMiddleware: MiddlewareFactoryType = (middleware: NextMiddleware) => {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const method = req.method;

    if (pathCheck(pathname, requiredPath)) {
      const token = await getToken({
        req,
        secret: process.env.APP_KEY,
      });

      if (!token) {
        return ResponseFormating.json("Unauthorized", 401);
      } else if (token) {
        // admin api
        if (token?.id_user_role !== 1 && adminApi.includes(pathname)) {
          return ResponseFormating.json("Unauthorized", 401);
        }
        // exam api
        if (
          token?.id_user_role !== 1 &&
          token?.id_user_role !== 2 &&
          pathCheck(pathname, examApi)
        ) {
          return ResponseFormating.json("Unauthorized", 401);
        }
      }
    }

    return middleware(req, next);
  };
};

export default ApiMiddleware;
