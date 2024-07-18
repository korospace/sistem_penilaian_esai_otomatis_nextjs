// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { RecalculateExamResult } from "@/lib/services/mysql/examResult";
// types
import { SessionType } from "@/lib/types/ResultTypes";

/**
 * Get Result
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // logic
  const res = await RecalculateExamResult(session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
