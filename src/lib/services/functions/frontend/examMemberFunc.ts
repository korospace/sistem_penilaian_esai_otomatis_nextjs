// types
import {
  ExamMemberInputType,
  ExamMemberStatuUpdateType,
} from "@/lib/types/InputTypes"
import { ApiResponseType } from "@/lib/types/ResultTypes"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

/**
 * Get Exam Member
 * -----------------------------
 */
export const HttpGetExamMember = async (
  path: string,
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["exam_member"],
      },
      // cache: "force-cache",
    })

    const resJson = await res.json()

    if (res.ok) {
      return {
        status: true,
        message: "Exam member retrieved successfully",
        data: resJson.data,
      }
    } else {
      return {
        status: false,
        message: resJson.message,
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
}

/**
 * Get Exam Member BY ID
 * -----------------------------
 */
export const HttpGetExamMemberById = async (
  path: string,
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      // cache: "force-cache",
    })

    const resJson = await res.json()

    if (res.ok) {
      return {
        status: true,
        message: "Exam member retrieved successfully",
        data: resJson.data,
      }
    } else {
      return {
        status: false,
        message: resJson.message,
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
}

/**
 * Create & Update Exam Member
 * -----------------------------
 */
export const HttpSaveExamMember = async (
  apiPath: string,
  method: string,
  data: ExamMemberInputType,
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath, {
      method: method,
      body: JSON.stringify(data),
    })

    const resJson = await res.json()

    if (res.ok) {
      return {
        status: true,
        message: "Exam member save successfully",
        data: resJson.data,
      }
    } else {
      return {
        status: false,
        message: resJson.message,
        data: resJson.data,
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
}

/**
 * Delete Exam Member
 * --------------------------
 */
export const HttpDeleteExamMember = async (
  id_exam_member: number,
  apiPath: string,
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(
      baseUrl + apiPath + `?id_exam_member=${id_exam_member}`,
      {
        method: "DELETE",
      },
    )

    const resJson = await res.json()

    if (res.ok) {
      return {
        status: true,
        message: "Exam member deleted successfully",
        data: resJson.data,
      }
    } else {
      return {
        status: false,
        message: resJson.message,
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
}

/**
 * Update Exam Member Status
 * -----------------------------
 */
export const HttpUpdateExamMemberStatus = async (
  apiPath: string,
  method: string,
  data: ExamMemberStatuUpdateType,
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath, {
      method: method,
      body: JSON.stringify(data),
    })

    const resJson = await res.json()

    if (res.ok) {
      return {
        status: true,
        message: "Exam member status update successfully",
        data: resJson.data,
      }
    } else {
      return {
        status: false,
        message: resJson.message,
        data: resJson.data,
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
}
