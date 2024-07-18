// nextjs
import { revalidateTag } from "next/cache";
// prisma
import { prisma } from "@/lib/db/init";
// types
import { ApiResponseType, SessionType } from "@/lib/types/ResultTypes";
import {
  ExamQuestionInputType,
  ExamQuestionSearchParamType,
  ExamQuestionWhereType,
  PaginationOptionsType,
} from "@/lib/types/InputTypes";

/**
 * Get Exam Question
 * -------------------------------
 */
export async function GetExamQuestion(
  searchParams: ExamQuestionSearchParamType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // -- params value --
    const page = searchParams.page;
    const limit = searchParams.limit;
    const keyword = searchParams.keyword;
    const id_exam = !isNaN(parseInt(searchParams.id_exam ?? "0"))
      ? parseInt(searchParams.id_exam)
      : 0;

    // -- where clause --
    const whereClause: ExamQuestionWhereType = {
      OR: [
        {
          question: {
            contains: keyword,
          },
        },
      ],
    };
    // AND
    if (id_exam) {
      whereClause.id_exam = id_exam;
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
    const listExamQuestion = await prisma.examQuestion.findMany({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
      orderBy: {
        created_date: "asc",
      },
      ...paginationParam,
    });

    // -- count rows --
    const countRow = await prisma.examQuestion.count({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
    });

    return {
      status: true,
      code: 200,
      message: "exam member list",
      totalPage: limit ? Math.ceil(countRow / parseInt(limit)) : 0,
      totalRow: countRow,
      data: listExamQuestion,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Create Exam Question
 * -------------------------------
 */
export async function CreateExamQuestion(
  dataInput: ExamQuestionInputType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check exam is exist
    const dtExamExist = await prisma.exam.findFirst({
      where: {
        id_exam: dataInput.id_exam,
        deleted_by: 0,
      },
    });

    if (dtExamExist === null) {
      return { status: false, code: 404, message: "exam not found" };
    } else {
      // check exam question exist
      const dtExamQuestionExist = await prisma.examQuestion.findFirst({
        where: {
          id_exam: dataInput.id_exam,
          question: dataInput.question,
          deleted_by: 0,
        },
      });

      if (dtExamQuestionExist != null) {
        return { status: false, code: 400, message: "exam question is exist" };
      } else {
        const newData = await prisma.examQuestion.create({
          data: {
            id_exam: dataInput.id_exam,
            question: dataInput.question,
            answer_key: dataInput.answer_key,
            created_by:
              session.user.id_user_role !== 1 ? session.user.id_user : 0,
          },
        });

        revalidateTag("exam_question");
        return {
          status: true,
          code: 201,
          message: "exam question created successfully",
          data: newData,
        };
      }
    }
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Update Exam Question
 * -------------------------------
 */
export async function UpdateExamQuestion(
  dataInput: ExamQuestionInputType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check exam is exist
    const dtExamExist = await prisma.exam.findFirst({
      where: {
        id_exam: dataInput.id_exam,
        deleted_by: 0,
      },
    });

    if (dtExamExist === null) {
      return { status: false, code: 404, message: "exam not found" };
    } else {
      // check exam question exist
      const dtExamQuestionExist = await prisma.examQuestion.findFirst({
        where: {
          id_exam_question: { not: dataInput.id_exam_question },
          id_exam: dataInput.id_exam,
          question: dataInput.question,
          deleted_by: 0,
        },
      });

      if (dtExamQuestionExist != null) {
        return { status: false, code: 400, message: "exam question is exist" };
      } else {
        const exam = await prisma.examQuestion.update({
          data: {
            id_exam: dataInput.id_exam,
            question: dataInput.question,
            answer_key: dataInput.answer_key,
            updated_by:
              session.user.id_user_role !== 1 ? session.user.id_user : 0,
            updated_date: new Date(),
          },
          where: {
            id_exam_question: dataInput.id_exam_question,
          },
        });

        revalidateTag("exam_question");
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
 * Delete Exam Question
 * -------------------------------
 */
export async function DeleteExamQuestion(
  id_exam_question: number,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // check exam question is exist
    const checkExist = await prisma.examQuestion.findFirst({
      where: {
        id_exam_question: id_exam_question,
        deleted_by: 0,
      },
    });

    if (checkExist === null) {
      return {
        status: false,
        code: 404,
        message: "exam question is not exist",
      };
    } else {
      const examQuestion = await prisma.examQuestion.update({
        data: {
          deleted_by: session.user.id_user,
          deleted_date: new Date(),
        },
        where: {
          id_exam_question: id_exam_question,
        },
      });

      revalidateTag("exam_question");
      return {
        status: true,
        code: 200,
        message: "exam question delete successfully",
      };
    }
  } catch (error: any) {
    return { status: true, code: 500, message: error.message };
  }
}
