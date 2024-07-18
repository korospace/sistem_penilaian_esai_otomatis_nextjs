// nextjs
import { NextRequest } from "next/server";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { GetSynonym } from "@/lib/services/mysql/synonym";

/**
 * Get Exam Member
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // logic
  const res = await GetSynonym();

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
