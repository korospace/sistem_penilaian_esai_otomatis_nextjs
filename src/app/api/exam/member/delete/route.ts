// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// types
import { SessionType } from "@/lib/types/ResultTypes";
// services
import { DeleteExamMember } from "@/lib/services/mysql/examMember";

/**
 * Delete Exam Question
 * -------------------------
 */
export async function DELETE(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const id_exam_question = searchParams.get("id_exam_member");

  // logic
  const res = await DeleteExamMember(
    parseInt(id_exam_question ?? "0"),
    session
  );

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
