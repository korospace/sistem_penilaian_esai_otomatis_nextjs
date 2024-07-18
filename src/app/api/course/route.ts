// nextjs
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// auth
import authOptions from "../auth/[...nextauth]/authOptions";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
// services
import { GetCourse } from "@/lib/services/mysql/course";
// types
import {
  CourseSearchType,
  PaginationOptionsType,
} from "@/lib/types/InputTypes";
import { SessionType } from "@/lib/types/ResultTypes";

/**
 * Get Course
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
  const searchParam: CourseSearchType = {
    OR: [
      {
        name: {
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
  const res = await GetCourse(searchParam, paginationParam);

  // response api
  const data = {
    totalRow: res.totalRow,
    totalPage: res.totalPage,
    data: res.data,
  };
  return ResponseFormating.json(res.message, res.code, data);
}
