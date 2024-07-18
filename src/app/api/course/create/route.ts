// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { CreateCourse } from "@/lib/services/mysql/course";
// validation request
import { CourseInputValidation } from "@/lib/validation/request";
// types
import { PaginationOptionsType } from "@/lib/types/InputTypes";
import { SessionType } from "@/lib/types/ResultTypes";

/**
 * Create Admin
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = CourseInputValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await CreateCourse(req, session.user.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
