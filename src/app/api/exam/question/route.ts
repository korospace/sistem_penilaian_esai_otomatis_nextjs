// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// types
import { SessionType } from "@/lib/types/ResultTypes";
import { ExamQuestionSearchParamType } from "@/lib/types/InputTypes";
// services
import { GetExamQuestion } from "@/lib/services/mysql/examQuestion";

/**
 * Get Exam Question
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const examSearch: ExamQuestionSearchParamType = {
    page: searchParams.get("page") ?? "",
    limit: searchParams.get("limit") ?? "",
    keyword: searchParams.get("keyword") ?? "",
    id_exam: searchParams.get("id_exam") ?? "",
  };

  // logic
  const res = await GetExamQuestion(examSearch, session);

  // response api
  const data = {
    totalRow: res.totalRow,
    totalPage: res.totalPage,
    data: res.data,
  };
  return ResponseFormating.json(res.message, res.code, data);
}
