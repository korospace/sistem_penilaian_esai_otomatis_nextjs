// nextjs
import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
// auth
import authOptions from "@/app/api/auth/[...nextauth]/authOptions"
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers"
// types
import { SessionType } from "@/lib/types/ResultTypes"
// services
import { GetExamMemberById } from "@/lib/services/mysql/examMember"

/**
 * Get Exam Member
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType

  // url params
  const { searchParams } = new URL(request.url)

  const id_exam = searchParams.get("id_exam") ?? ""

  // logic
  const res = await GetExamMemberById(id_exam)

  // response api
  const data = {
    data: res.data,
  }
  return ResponseFormating.json(res.message, res.code, data)
}
