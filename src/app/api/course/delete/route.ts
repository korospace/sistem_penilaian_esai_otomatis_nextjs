// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { DeleteCourse } from "@/lib/services/mysql/course";
// types
import { SessionType } from "@/lib/types/ResultTypes";

/**
 * Delete Course
 * -------------------------
 */
export async function DELETE(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const id_course = searchParams.get("id_course");

  // logic
  const res = await DeleteCourse(
    parseInt(id_course ?? "0"),
    session.user.id_user
  );

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
