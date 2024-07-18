// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { GetUser, UpdateUser } from "@/lib/services/mysql/user";
// types
import { SessionType } from "@/lib/types/ResultTypes";
import { UserInputType, UserSearchType } from "@/lib/types/InputTypes";
// validation request
import { UserUpdateValidation } from "@/lib/validation/request";

/**
 * Get Profile
 * -------------------------
 */
export async function GET() {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // search param
  const searchParam: UserSearchType = {
    id_user: session.user.id_user,
  };

  // logic
  const res = await GetUser(searchParam);

  // response api
  return ResponseFormating.json(
    res.message,
    res.code,
    res.data.length > 0 ? res.data[0] : null
  );
}

/**
 * Update Profile
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = (await request.json()) as UserInputType;

  // validation
  const validationResult = UserUpdateValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  req.id_user = session.user.id_user;
  const res = await UpdateUser(req, req.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
