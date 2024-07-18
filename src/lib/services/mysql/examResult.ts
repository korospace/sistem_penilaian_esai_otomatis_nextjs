// prisma
import { prisma } from "@/lib/db/init";
// helpers
import { EssayCorrection } from "@/lib/helpers/essay_correction";
// types
import {
  ExamAnswerInputType,
  ExamAnswerWhereType,
  ExamMemberStatuUpdateType,
  ExamResultSearchParamType,
  TrainingInputType,
  TrainingInputV2Type,
} from "@/lib/types/InputTypes";
import { ApiResponseType, SessionType } from "@/lib/types/ResultTypes";
// services
import { SaveExamAnswer } from "./examAnswer";
import { UpdateExamMemberStatus } from "./examMember";

/**
 * Get Exam Result
 * -------------------------
 */
export async function GetExamResult(
  searchParams: ExamResultSearchParamType,
  session: SessionType
): Promise<ApiResponseType> {
  try {
    // -- params value --
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

    // -- get question table --
    const listExamQuestion = await prisma.examQuestion.findMany({
      where: {
        id_exam: id_exam,
        deleted_by: 0,
      },
      orderBy: {
        created_date: "asc",
      },
    });

    // -- get answer table --
    const listExamAnswer = await prisma.examAnswer.findMany({
      where: {
        ...whereClause,
      },
    });

    // -- answer & answer key list --
    const questionAnswerList: TrainingInputV2Type[] = listExamQuestion.map(
      (rowQuestion) => {
        const answer = listExamAnswer.find(
          (rowAnswer) =>
            rowAnswer.id_exam_question === rowQuestion.id_exam_question
        );

        return {
          similiarity_matrix: answer?.similiariy_matrix ?? "",
          max_simmatrix: answer?.max_simmatrix ?? "",
          answer: {
            raw_value: answer?.answer,
            cleaned: answer?.answer_cleaning,
            stemmed: answer?.answer_stemming,
            stopword_removed: answer?.answer_stopword,
            synonym_replaced: answer?.answer_sp ?? "",
            n_gram: answer?.answer_ngram,
          },
          answer_key: {
            raw_value: answer?.answer_key,
            cleaned: answer?.answer_key_cleaning,
            stemmed: answer?.answer_key_stemming,
            stopword_removed: answer?.answer_key_stopword,
            n_gram: answer?.answer_key_ngram,
          },
        };
      }
    );

    // -- training --
    const dtTraining = await EssayCorrection.trainingDataV2(questionAnswerList);

    return {
      status: true,
      code: 200,
      message: "exam result",
      data: dtTraining,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Get Exam Result - from XLSX
 * ---------------------------
 */
export async function GetExamResultFromExcel(
  dataInput: TrainingInputType[]
): Promise<ApiResponseType> {
  try {
    // -- training --
    const dtTraining = await EssayCorrection.trainingData(dataInput);

    return {
      status: true,
      code: 200,
      message: "exam result",
      data: dtTraining,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}

/**
 * Recalculate Exam Result
 * -------------------------
 */
export async function RecalculateExamResult(
  session: SessionType
): Promise<ApiResponseType> {
  try {
    const listExamMember = await prisma.examMember.findMany({});
    const listExamAnswer = await prisma.examAnswer.findMany({});

    // -- Update All Exam Member Status --
    for (let iteration = 0; iteration < listExamMember.length; iteration++) {
      const member = listExamMember[iteration];
      console.log(member);

      const data: ExamMemberStatuUpdateType = {
        id_exam_member: member.id_exam_member,
        status: "ON_GOING",
      };

      const res = await UpdateExamMemberStatus(data, session);
      console.log(res);
    }

    // -- Update All Exam Answer --
    for (let iteration = 0; iteration < listExamAnswer.length; iteration++) {
      const answer = listExamAnswer[iteration];

      const data: ExamAnswerInputType = {
        id_exam_answer: Number(answer.id_exam_answer),
        id_exam_question: answer.id_exam_question,
        id_user: answer.id_user,
        answer: answer.answer,
      };

      const res = await SaveExamAnswer(data, session);
      console.log(res);
    }

    // -- Update All Exam Member Status --
    for (let iteration = 0; iteration < listExamMember.length; iteration++) {
      const member = listExamMember[iteration];

      const data: ExamMemberStatuUpdateType = {
        id_exam_member: member.id_exam_member,
        status: "COMPLETED",
      };

      const res = await UpdateExamMemberStatus(data, session);
      console.log(res);
    }

    return {
      status: true,
      code: 200,
      message: "recalculate success",
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}
