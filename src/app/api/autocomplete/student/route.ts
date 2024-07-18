// nextjs
import { NextRequest } from "next/server";
// service
import { GetStudentAuctocomplete } from "@/lib/services/mysql/user";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";

export async function GET(request: NextRequest) {
  // url params
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  // logic
  const res = await GetStudentAuctocomplete(keyword ?? "");

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
