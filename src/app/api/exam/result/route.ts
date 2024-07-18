// nextjs
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// types
import { SessionType } from "@/lib/types/ResultTypes";
import {
  ExamResultSearchParamType,
  TrainingInputType,
} from "@/lib/types/InputTypes";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import {
  GetExamResult,
  GetExamResultFromExcel,
} from "@/lib/services/mysql/examResult";
// validation
import { TrainingInputValidation } from "@/lib/validation/request";

/**
 * Get Result
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);

  const examSearch: ExamResultSearchParamType = {
    id_exam: searchParams.get("id_exam") ?? "",
    id_user: searchParams.get("id_user") ?? "",
  };

  // logic
  const res = await GetExamResult(examSearch, session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}

/**
 * Get Result From XLSX
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // json
  const req = await request.json();
  const reqModified = req as TrainingInputType[];

  // validation
  let valid = true;
  reqModified.forEach((row) => {
    const validationResult = TrainingInputValidation.safeParse(row);

    if (!validationResult.success) {
      valid = false;
    }
  });

  if (!valid) {
    return ResponseFormating.json("invalid excel format", 400);
  }

  // logic
  const res = await GetExamResultFromExcel(reqModified);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
