// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// validation request
import {
  ExamInputValidation,
  ExamUpdateValidation,
} from "@/lib/validation/request";
// types
import { SessionType } from "@/lib/types/ResultTypes";
import { ExamSearchParamType } from "@/lib/types/InputTypes";
// services
import {
  CreateExam,
  DeleteExam,
  GetExam,
  UpdateExam,
} from "@/lib/services/mysql/exam";

/**
 * Get Exam
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const examSearch: ExamSearchParamType = {
    page: searchParams.get("page") ?? "",
    limit: searchParams.get("limit") ?? "",
    keyword: searchParams.get("keyword") ?? "",
    id_course: searchParams.get("id_course") ?? "",
    id_exam: searchParams.get("id_exam") ?? "",
    status: searchParams.get("status") ?? "",
  };

  // logic
  const res = await GetExam(examSearch, session);

  // response api
  const data = {
    totalRow: res.totalRow,
    totalPage: res.totalPage,
    data: res.data,
  };
  return ResponseFormating.json(res.message, res.code, data);
}

/**
 * Create Exam
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = ExamInputValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await CreateExam(req, session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}

/**
 * Update Exam
 * -------------------------
 */
export async function PUT(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = ExamUpdateValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await UpdateExam(req, session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}

/**
 * Delete Exam
 * -------------------------
 */
export async function DELETE(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const id_exam = searchParams.get("id_exam");

  // logic
  const res = await DeleteExam(parseInt(id_exam ?? "0"), session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
