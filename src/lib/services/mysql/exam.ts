// nextjs
import { revalidateTag } from "next/cache";
// prisma
import { prisma } from "@/lib/db/init";
// types
import { ApiResponseType, SessionType } from "@/lib/types/ResultTypes";
import {
  ExamInputType,
  ExamSearchParamType,
  ExamWhereType,
  PaginationOptionsType,
} from "@/lib/types/InputTypes";

/**
 * Get Exam
 * -------------------------------
 */
export async function GetExam(
  searchParams: ExamSearchParamType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // -- params value --
    const page = searchParams.page;
    const limit = searchParams.limit;
    const keyword = searchParams.keyword;
    const status = searchParams.status;
    const id_exam = !isNaN(parseInt(searchParams.id_exam ?? "0"))
      ? parseInt(searchParams.id_exam)
      : 0;
    const id_course = !isNaN(parseInt(searchParams.id_course ?? "0"))
      ? parseInt(searchParams.id_course)
      : 0;

    // -- include ==
    let include: any = {
      course: true,
    };

    // -- where clause --
    const whereClause: ExamWhereType = {
      OR: [
        {
          title: {
            contains: keyword,
          },
        },
      ],
    };
    // AND
    if (id_exam) {
      whereClause.id_exam = id_exam;
    }
    if (session.user.id_user_role === 2) {
      whereClause.created_by = {
        in: [session.user.id_user, 0],
      };
    }
    if (session.user.id_user_role === 3) {
      include.exam_member = {
        where: {
          id_user: session.user.id_user,
          deleted_by: 0,
        },
      };

      whereClause.exam_member = {
        some: {
          id_user: session.user.id_user,
        },
      };

      if (status) {
        whereClause.exam_member.some.status = status.toUpperCase();
      }
    }
    // OR
    if (whereClause.OR && id_course) {
      whereClause.OR[0].id_course = id_course;
    }

    // -- pagination --
    let paginationParam: PaginationOptionsType | undefined;
    if (page && limit) {
      paginationParam = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      };
    }

    // -- get rows --
    const listExam = await prisma.exam.findMany({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
      include: {
        ...include,
      },
      orderBy: {
        id_exam: "desc",
      },
      ...paginationParam,
    });

    // -- count rows --
    const countRow = await prisma.exam.count({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
    });

    return {
      status: true,
      code: 200,
      message: "exam list",
      totalPage: limit ? Math.ceil(countRow / parseInt(limit)) : 0,
      totalRow: countRow,
      data: listExam,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Create Exam
 * -------------------------------
 */
export async function CreateExam(
  dataInput: ExamInputType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check course exist
    const dtCourseExist = await prisma.course.findFirst({
      where: {
        id_course: dataInput.id_course,
        deleted_by: 0,
      },
    });

    if (dtCourseExist === null) {
      return { status: false, code: 404, message: "course not found" };
    } else {
      // check exam exist
      const dtExamExist = await prisma.exam.findFirst({
        where: {
          title: dataInput.title,
          id_course: dataInput.id_course,
          deleted_by: 0,
        },
      });

      if (dtExamExist != null) {
        return { status: false, code: 400, message: "exam is exist" };
      } else {
        const newData = await prisma.exam.create({
          data: {
            id_course: dataInput.id_course,
            title: dataInput.title,
            description: dataInput.description,
            start_date: new Date(dataInput.start_date),
            end_date: new Date(dataInput.end_date),
            duration: dataInput.duration,
            created_by:
              session.user.id_user_role !== 1 ? session.user.id_user : 0,
          },
        });

        revalidateTag("exam");
        return {
          status: true,
          code: 201,
          message: "exam created successfully",
          data: newData,
        };
      }
    }
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Update Exam
 * -------------------------------
 */
export async function UpdateExam(
  dataInput: ExamInputType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check course exist
    const dtCourseExist = await prisma.course.findFirst({
      where: {
        id_course: dataInput.id_course,
        deleted_by: 0,
      },
    });

    if (dtCourseExist === null) {
      return { status: false, code: 404, message: "course not found" };
    } else {
      // check exam exist
      const dtExamExist = await prisma.exam.findFirst({
        where: {
          title: dataInput.title,
          id_course: dataInput.id_course,
          id_exam: { not: dataInput.id_exam },
          deleted_by: 0,
        },
      });

      if (dtExamExist != null) {
        return { status: false, code: 400, message: "exam is exist" };
      } else {
        const exam = await prisma.exam.update({
          data: {
            id_course: dataInput.id_course,
            title: dataInput.title,
            description: dataInput.description,
            start_date: new Date(dataInput.start_date),
            end_date: new Date(dataInput.end_date),
            duration: dataInput.duration,
            updated_by:
              session.user.id_user_role !== 1 ? session.user.id_user : 0,
            updated_date: new Date(),
          },
          where: {
            id_exam: dataInput.id_exam,
          },
        });

        revalidateTag("exam");
        return {
          status: true,
          code: 201,
          message: "exam update successfully",
          data: exam,
        };
      }
    }
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Delete Exam
 * -------------------------------
 */
export async function DeleteExam(
  id_exam: number,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check exam is exist
    const checkExist = await prisma.exam.findFirst({
      where: {
        id_exam: id_exam,
        deleted_by: 0,
      },
    });

    if (checkExist === null) {
      return {
        status: false,
        code: 404,
        message: "exam is not exist",
      };
    } else {
      const exam = await prisma.exam.update({
        data: {
          deleted_by: session.user.id_user,
          deleted_date: new Date(),
        },
        where: {
          id_exam: id_exam,
        },
      });

      revalidateTag("exam");
      return {
        status: true,
        code: 200,
        message: "exam delete successfully",
      };
    }
  } catch (error: any) {
    return { status: true, code: 500, message: error.message };
  }
}
