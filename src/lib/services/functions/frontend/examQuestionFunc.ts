// types
import { ExamQuestionInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Exam Question
 * -----------------------------
 */
export const HttpGetExamQuestion = async (
  path: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["exam_question"],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam question retrieved successfully",
        data: resJson.data,
      };
    } else {
      return {
        status: false,
        message: resJson.message,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    };
  }
};

/**
 * Create & Update Exam Question
 * -----------------------------
 */
export const HttpSaveExamQuestion = async (
  apiPath: string,
  method: string,
  data: ExamQuestionInputType
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath, {
      method: method,
      body: JSON.stringify(data),
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam question save successfully",
        data: resJson.data,
      };
    } else {
      return {
        status: false,
        message: resJson.message,
        data: resJson.data,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    };
  }
};

/**
 * Delete Exam Question
 * --------------------------
 */
export const HttpDeleteExamQuestion = async (
  id_exam_question: number,
  apiPath: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(
      baseUrl + apiPath + `?id_exam_question=${id_exam_question}`,
      {
        method: "DELETE",
      }
    );

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam question deleted successfully",
        data: resJson.data,
      };
    } else {
      return {
        status: false,
        message: resJson.message,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    };
  }
};
