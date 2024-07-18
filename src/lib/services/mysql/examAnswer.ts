// prisma
import { prisma } from "@/lib/db/init";
// nextjs
import { revalidateTag } from "next/cache";
// types
import {
  ExamAnswerInputType,
  ExamAnswerSearchParamType,
  ExamAnswerWhereType,
  PaginationOptionsType,
  TrainingInputType,
} from "@/lib/types/InputTypes";
import { ApiResponseType, SessionType } from "@/lib/types/ResultTypes";
// helpers
import { DateFormating } from "@/lib/helpers/helpers";
import { EssayCorrection } from "@/lib/helpers/essay_correction";

/**
 * Get Exam Answer
 * -------------------------------
 */
export async function GetExamAnswer(
  searchParams: ExamAnswerSearchParamType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // -- params value --
    const page = searchParams.page;
    const limit = searchParams.limit;
    const keyword = searchParams.keyword;
    let id_exam = !isNaN(parseInt(searchParams.id_exam ?? "0"))
      ? parseInt(searchParams.id_exam)
      : 0;
    let id_user = !isNaN(parseInt(searchParams.id_user ?? "0"))
      ? parseInt(searchParams.id_user)
      : 0;

    // -- Authorization --
    if (session.user.id_user_role === 3) {
      if (id_user !== session.user.id_user) {
        return { status: false, code: 404, message: "not found" };
      }
    }

    // -- where clause --
    const whereClause: ExamAnswerWhereType = {
      exam_question: {
        id_exam: id_exam,
      },
      user: {
        id_user: id_user,
      },
    };

    // -- pagination --
    let paginationParam: PaginationOptionsType | undefined;
    if (page && limit) {
      paginationParam = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      };
    }

    // -- get rows --
    const listExamAnswer = await prisma.examAnswer.findMany({
      where: {
        ...whereClause,
      },
      orderBy: {
        exam_question: {
          created_date: "asc",
        },
      },
      ...paginationParam,
    });

    const listExamAnswerWithConvertedBigInt = listExamAnswer.map((answer) => ({
      ...answer,
      id_exam_answer: answer.id_exam_answer.toString(),
    }));

    // -- count rows --
    const countRow = await prisma.examAnswer.count({
      where: {
        ...whereClause,
        deleted_by: 0,
      },
    });

    return {
      status: true,
      code: 200,
      message: "exam answer list",
      totalPage: limit ? Math.ceil(countRow / parseInt(limit)) : 0,
      totalRow: countRow,
      data: listExamAnswerWithConvertedBigInt,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Save Exam Answer
 * -------------------------------
 */
export async function SaveExamAnswer(
  dataInput: ExamAnswerInputType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // -- Authorization --
    if (session.user.id_user_role === 3) {
      if (dataInput.id_user !== session.user.id_user) {
        return { status: false, code: 404, message: "not found" };
      }
    }

    // -- check allow answer --
    const dtAllow = await checkAllowAnswer(
      dataInput.id_exam_question,
      dataInput.id_user
    );
    if (dtAllow.status === false) {
      return dtAllow;
    }

    // -- check exam answer exist
    const dtExamAnswerExist = await prisma.examAnswer.findFirst({
      where: {
        id_exam_question: dataInput.id_exam_question,
        id_user: dataInput.id_user,
      },
    });

    // -- calculate result per-question
    const dtTraining = await EssayCorrection.trainingData([
      {
        answer: dataInput.answer,
        answer_key: dtAllow.data.answer_key,
      },
    ]);
    const dtTrainingDetail = dtTraining.details[0];

    if (dtExamAnswerExist === null) {
      // -- create answer
      await prisma.examAnswer.create({
        data: {
          id_exam_question: dataInput.id_exam_question,
          id_user: dataInput.id_user,
          answer: dataInput.answer,
          answer_cleaning: dtTrainingDetail.answer.cleaned || "",
          answer_stemming: dtTrainingDetail.answer.stemmed || "",
          answer_stopword: dtTrainingDetail.answer.stopword_removed || "",
          answer_sp: dtTrainingDetail.answer.synonym_replaced,
          answer_ngram: dtTrainingDetail.answer.n_gram || "",
          answer_key: dtTrainingDetail.answer_key.raw_value || "",
          answer_key_cleaning: dtTrainingDetail.answer_key.cleaned || "",
          answer_key_stemming: dtTrainingDetail.answer_key.stemmed || "",
          answer_key_stopword:
            dtTrainingDetail.answer_key.stopword_removed || "",
          answer_key_sp: dtTrainingDetail.answer_key.synonym_replaced,
          answer_key_ngram: dtTrainingDetail.answer_key.n_gram || "",
          similiariy_matrix: dtTrainingDetail.similiarity_matrix,
          max_simmatrix: dtTrainingDetail.max_simmatrix,
          created_by: session.user.id_user_role,
        },
      });
    } else {
      // -- update answer
      await prisma.examAnswer.update({
        data: {
          answer: dataInput.answer,
          answer_cleaning: dtTrainingDetail.answer.cleaned,
          answer_stemming: dtTrainingDetail.answer.stemmed,
          answer_stopword: dtTrainingDetail.answer.stopword_removed,
          answer_sp: dtTrainingDetail.answer.synonym_replaced,
          answer_ngram: dtTrainingDetail.answer.n_gram,
          answer_key: dtTrainingDetail.answer_key.raw_value,
          answer_key_cleaning: dtTrainingDetail.answer_key.cleaned,
          answer_key_stemming: dtTrainingDetail.answer_key.stemmed,
          answer_key_stopword: dtTrainingDetail.answer_key.stopword_removed,
          answer_key_sp: dtTrainingDetail.answer_key.synonym_replaced,
          answer_key_ngram: dtTrainingDetail.answer_key.n_gram,
          similiariy_matrix: dtTrainingDetail.similiarity_matrix,
          max_simmatrix: dtTrainingDetail.max_simmatrix,
          updated_by:
            session.user.id_user_role !== 1 ? session.user.id_user : 0,
          updated_date: new Date(),
        },
        where: {
          id_exam_answer: dataInput.id_exam_answer,
          id_exam_question: dataInput.id_exam_question,
          id_user: dataInput.id_user,
        },
      });
    }

    revalidateTag("exam_answer");
    return {
      status: true,
      code: 201,
      message: "exam answer save successfully",
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Check Allow Answer
 * -------------------------------
 */
export async function checkAllowAnswer(
  id_exam_question: number,
  id_user: number
): Promise<ApiResponseType> {
  // -- get detail question --
  const dtQuestion = await prisma.examQuestion.findFirst({
    select: {
      id_exam: true,
      answer_key: true,
    },
    where: {
      id_exam_question: id_exam_question,
      deleted_by: 0,
    },
  });

  if (dtQuestion === null) {
    return { status: false, code: 404, message: "exam question not found" };
  }

  // -- get detail exam --
  const dtExam = await prisma.exam.findFirst({
    select: {
      end_date: true,
    },
    where: {
      id_exam: dtQuestion.id_exam,
      deleted_by: 0,
    },
  });

  if (dtExam === null) {
    return { status: false, code: 404, message: "exam not found" };
  }

  // -- get detail member --
  const dtMember = await prisma.examMember.findFirst({
    select: {
      status: true,
    },
    where: {
      id_user: id_user,
      deleted_by: 0,
    },
  });

  if (dtMember === null) {
    return { status: false, code: 404, message: "exam member not found" };
  }

  // -- check exam member status --
  // if (dtMember.status === "COMPLETED") {
  //   return { status: false, code: 404, message: "not allowed" };
  // }

  // -- check exam end date --
  const unixEndDate = DateFormating.toUnixTimeStamp(dtExam.end_date.toString());
  const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

  if (unixEndDate < unixNow) {
    return { status: false, code: 404, message: "not allowed" };
  }

  return {
    status: true,
    code: 200,
    message: "nice",
    data: {
      answer_key: dtQuestion.answer_key,
    },
  };
}
