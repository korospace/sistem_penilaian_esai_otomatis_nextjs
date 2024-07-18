// nextjs
import { revalidateTag } from "next/cache"
// prisma
import { prisma } from "@/lib/db/init"
// types
import { ApiResponseType, SessionType } from "@/lib/types/ResultTypes"
import {
  ExamMemberInputType,
  ExamMemberSearchParamType,
  ExamMemberStatuUpdateType,
  ExamMemberWhereType,
  ExamResultSearchParamType,
  PaginationOptionsType,
} from "@/lib/types/InputTypes"
// services
import { GetExamResult } from "./examResult"

/**
 * Get Exam Member
 * -------------------------------
 */
export async function GetExamMember(
  searchParams: ExamMemberSearchParamType,
  session: SessionType,
): Promise<ApiResponseType> {
  try {
    // -- params value --
    const page = searchParams.page
    const limit = searchParams.limit
    const keyword = searchParams.keyword
    const id_exam = !isNaN(parseInt(searchParams.id_exam ?? "0"))
      ? parseInt(searchParams.id_exam)
      : 0
    const id_user = !isNaN(parseInt(searchParams.id_user ?? "0"))
      ? parseInt(searchParams.id_user)
      : 0

    // -- where clause --
    const whereClause: ExamMemberWhereType = {
      user: {
        OR: [
          {
            username: {
              contains: keyword,
            },
          },
          {
            full_name: {
              contains: keyword,
            },
          },
        ],
      },
    }
    // AND
    if (id_exam) {
      whereClause.id_exam = id_exam
    }
    if (id_user) {
      if (session.user.id_user_role === 3 && id_user != session.user.id_user) {
        whereClause.user.id_user = 0 // not found
      } else {
        whereClause.user.id_user = id_user
      }
    }

    // -- pagination --
    let paginationParam: PaginationOptionsType | undefined
    if (page && limit) {
      paginationParam = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }
    }

    // -- get rows --
    const listExamMember = await prisma.examMember.findMany({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
      include: {
        user: true,
      },
      orderBy: {
        id_exam_member: "desc",
      },
      ...paginationParam,
    })

    // -- count rows --
    const countRow = await prisma.examMember.count({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
    })

    return {
      status: true,
      code: 200,
      message: "exam member list",
      totalPage: limit ? Math.ceil(countRow / parseInt(limit)) : 0,
      totalRow: countRow,
      data: listExamMember,
    }
  } catch (error: any) {
    return { status: false, code: 500, message: error.message }
  }
}

/**
 * Get Exam Member BY Id
 * -------------------------------
 */
export async function GetExamMemberById(param_exam_id: string) {
  const id_exam = !isNaN(parseInt(param_exam_id ?? "0"))
    ? parseInt(param_exam_id)
    : 0

  try {
    const resultRowExamMember = await prisma.examMember.findMany({
      where: {
        id_exam: id_exam,
        status: "COMPLETED",
        deleted_by: 0,
      },
    })

    return {
      status: true,
      code: 200,
      message: "exam member by id",
      data: resultRowExamMember,
    }
  } catch (error: any) {
    return {
      status: false,
      code: 500,
      message: error.message,
    }
  }
}

/**
 * Create Exam Member
 * -------------------------------
 */
export async function CreateExamMember(
  dataInput: ExamMemberInputType,
  session: SessionType,
): Promise<ApiResponseType> {
  try {
    // check exam is exist
    const dtExamExist = await prisma.exam.findFirst({
      where: {
        id_exam: dataInput.id_exam,
        deleted_by: 0,
      },
    })

    if (dtExamExist === null) {
      return { status: false, code: 404, message: "exam not found" }
    } else {
      // check exam member exist
      const dtExamMemberExist = await prisma.examMember.findFirst({
        where: {
          id_exam: dataInput.id_exam,
          id_user: dataInput.id_user,
          deleted_by: 0,
        },
      })

      if (dtExamMemberExist != null) {
        return { status: false, code: 400, message: "exam member is exist" }
      } else {
        const newData = await prisma.examMember.create({
          data: {
            id_exam: dataInput.id_exam,
            id_user: dataInput.id_user,
            created_by: session.user.id_user_role,
          },
        })

        revalidateTag("exam_member")
        return {
          status: true,
          code: 201,
          message: "exam member created successfully",
          data: newData,
        }
      }
    }
  } catch (error: any) {
    return { status: false, code: 500, message: error.message }
  }
}

/**
 * Delete Exam Member
 * -------------------------------
 */
export async function DeleteExamMember(
  id_exam_member: number,
  session: SessionType,
): Promise<ApiResponseType> {
  try {
    // check exam member is exist
    const checkExist = await prisma.examMember.findFirst({
      where: {
        id_exam_member: id_exam_member,
        deleted_by: 0,
      },
    })

    if (checkExist === null) {
      return {
        status: false,
        code: 404,
        message: "exam member is not exist",
      }
    } else {
      const examMember = await prisma.examMember.update({
        data: {
          deleted_by: session.user.id_user,
          deleted_date: new Date(),
        },
        where: {
          id_exam_member: id_exam_member,
        },
      })

      revalidateTag("exam_member")
      return {
        status: true,
        code: 200,
        message: "exam member delete successfully",
      }
    }
  } catch (error: any) {
    return { status: true, code: 500, message: error.message }
  }
}

/**
 * Update Exam Member Status
 * -------------------------------
 */
export async function UpdateExamMemberStatus(
  dataInput: ExamMemberStatuUpdateType,
  session: SessionType,
): Promise<ApiResponseType> {
  try {
    // check exam member is exist
    const checkExist = await prisma.examMember.findFirst({
      where: {
        id_exam_member: dataInput.id_exam_member,
        deleted_by: 0,
      },
    })

    if (checkExist === null) {
      return {
        status: false,
        code: 404,
        message: "exam member is not exist",
      }
    } else {
      if (
        checkExist.status === "NOT_YET" &&
        dataInput.status === "ON_GOING" &&
        session.user.id_user_role !== 3
      ) {
        return {
          status: false,
          code: 400,
          message: "the member is not take exam at all",
        }
      } else {
        // -- get exam result --
        let newScore = 0
        let newGrade = ""
        if (dataInput.status === "COMPLETED") {
          const examSearch: ExamResultSearchParamType = {
            id_exam: checkExist.id_exam.toString(),
            id_user: checkExist.id_user.toString(),
          }

          const dtResult = await GetExamResult(examSearch, session)

          if (dtResult.status === false) {
            return dtResult
          } else {
            newScore = dtResult.data.grade.score
            newGrade = dtResult.data.grade.grade
          }
        }

        // -- update exam member --
        const examMember = await prisma.examMember.update({
          data: {
            start_date:
              dataInput.status === "ON_GOING"
                ? new Date()
                : checkExist.start_date,
            end_date:
              dataInput.status === "COMPLETED"
                ? new Date()
                : dataInput.status === "ON_GOING"
                ? null
                : checkExist.end_date,
            score:
              dataInput.status === "COMPLETED"
                ? parseFloat(newScore.toFixed(2))
                : checkExist.score,
            grade:
              dataInput.status === "COMPLETED" ? newGrade : checkExist.grade,
            status: dataInput.status,
            updated_by:
              session.user.id_user_role !== 1 ? session.user.id_user : 0,
            updated_date: new Date(),
          },
          where: {
            id_exam_member: dataInput.id_exam_member,
          },
        })

        revalidateTag("exam_member")
        return {
          status: true,
          code: 200,
          message: "exam member status update successfully",
        }
      }
    }
  } catch (error: any) {
    return { status: true, code: 500, message: error.message }
  }
}
