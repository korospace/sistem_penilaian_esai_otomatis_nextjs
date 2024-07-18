// types
import { LevInputType, TrainingInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Exam Result
 * -----------------------------
 */
export const HttpGetExamResult = async (
  path: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["exam_result"],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam result retrieved successfully",
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
 * Get Exam Result - XLSX
 * -----------------------------
 */
export const HttpGetExamResultFromExcel = async (
  path: string,
  data: TrainingInputType[]
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam result retrieved successfully",
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
 * Get Exam Result Lev Each Word
 * -----------------------------
 */
export const HttpGetExamResultLevEachWord = async (
  path: string,
  data: LevInputType
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam result lev each word retrieved successfully",
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
