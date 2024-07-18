// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import {
  DeleteUser,
  UpdateUser,
  CreateUser,
  GetUser,
} from "@/lib/services/mysql/user";
// validation request
import {
  UserInputValidation,
  UserUpdateValidation,
} from "@/lib/validation/request";
// types
import { PaginationOptionsType, UserSearchType } from "@/lib/types/InputTypes";
import { SessionType } from "@/lib/types/ResultTypes";

/**
 * Get Admin
 * -------------------------
 */
export async function GET(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const keyword = searchParams.get("keyword");

  // search param
  const searchParam: UserSearchType = {
    id_user_role: 1,
    id_user: { not: session.user.id_user },
    OR: [
      {
        username: {
          contains: keyword ?? "",
        },
      },
      {
        full_name: {
          contains: keyword ?? "",
        },
      },
    ],
  };

  // pagination param
  let paginationParam: PaginationOptionsType | undefined;
  if (page !== null && limit !== null) {
    paginationParam = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    };
  }

  // logic
  const res = await GetUser(searchParam, paginationParam);

  // response api
  const data = {
    totalRow: res.totalRow,
    totalPage: res.totalPage,
    data: res.data,
  };
  return ResponseFormating.json(res.message, res.code, data);
}

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
  const validationResult = UserInputValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  req.id_user_role = 1;
  const res = await CreateUser(req, session.user.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}

/**
 * Update Admin
 * -------------------------
 */
export async function PUT(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // json
  const req = await request.json();

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
  req.id_user_role = 1;
  const res = await UpdateUser(req, session.user.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}

/**
 * Delete Admin
 * -------------------------
 */
export async function DELETE(request: NextRequest) {
  // session
  const session = (await getServerSession(authOptions)) as SessionType;

  // url params
  const { searchParams } = new URL(request.url);
  const id_user = searchParams.get("id_user");

  // logic
  const res = await DeleteUser(parseInt(id_user ?? "0"), session.user.id_user);

  // response api
  return ResponseFormating.json(res.message, res.code, res.data);
}
