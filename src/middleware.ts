// nextjs
import { NextMiddleware, NextResponse } from "next/server";
// types
import { MiddlewareFactoryType } from "@/lib/types/ResultTypes";
// middlewares
import {
  ApiMiddleware,
  HeaderMiddleware,
  PageMiddleware,
} from "./lib/middlewares";

export function ChainMiddleare(
  functions: MiddlewareFactoryType[] = [],
  index = 0
): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = ChainMiddleare(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}

export default ChainMiddleare([
  HeaderMiddleware,
  ApiMiddleware,
  PageMiddleware,
]);
