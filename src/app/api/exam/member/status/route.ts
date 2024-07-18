// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// validation request
import { ExamMemberStatusUpdateValidation } from "@/lib/validation/request";
// types
import { SessionType } from "@/lib/types/ResultTypes";
// services
import { UpdateExamMemberStatus } from "@/lib/services/mysql/examMember";

/**
 * Update Exam Member Status
 * -------------------------
 */
export async function PUT(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = ExamMemberStatusUpdateValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await UpdateExamMemberStatus(req, session);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
