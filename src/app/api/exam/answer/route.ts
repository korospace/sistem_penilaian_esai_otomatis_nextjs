// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// validation request
import { ExamAnswerInputValidation } from "@/lib/validation/request";
// types
import { SessionType } from "@/lib/types/ResultTypes";
import { ExamAnswerSearchParamType } from "@/lib/types/InputTypes";
// services
import { SaveExamAnswer, GetExamAnswer } from "@/lib/services/mysql/examAnswer";

/**
 * Get Exam Answer
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);

  const examSearch: ExamAnswerSearchParamType = {
    page: searchParams.get("page") ?? "",
    limit: searchParams.get("limit") ?? "",
    keyword: searchParams.get("keyword") ?? "",
    id_exam: searchParams.get("id_exam") ?? "",
    id_user: searchParams.get("id_user") ?? "",
  };

  // logic
  const res = await GetExamAnswer(examSearch, session);

  // response api
  const data = {
    totalRow: res.totalRow,
    totalPage: res.totalPage,
    data: res.data,
  };
  return ResponseFormating.json(res.message, res.code, data);
}

/**
 * Save Exam Answer
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = ExamAnswerInputValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await SaveExamAnswer(req, session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
