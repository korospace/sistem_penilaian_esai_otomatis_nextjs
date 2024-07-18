// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { UpdateCourse } from "@/lib/services/mysql/course";
// types
import { SessionType } from "@/lib/types/ResultTypes";
// validation
import { CourseUpdateValidation } from "@/lib/validation/request";

/**
 * Update Course
 * -------------------------
 */
export async function PUT(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

  // validation
  const validationResult = CourseUpdateValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const res = await UpdateCourse(req, session.user.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
