// types
import { SelectOptionType } from "@/lib/types/ComponentTypes";
import { ApiResponseType, CourseType } from "@/lib/types/ResultTypes";
import { ExamInputType } from "@/lib/types/InputTypes";
// services
import { HttpGetCourse } from "./courseFunc";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Status Option
 * --------------------------
 */
export const GetExamStatuOpt = (): SelectOptionType[] => {
  return [
    {
      key: "",
      value: "-- Status --",
    },
    {
      key: "not_yet",
      value: "Not Yet",
    },
    {
      key: "on_going",
      value: "on going",
    },
    {
      key: "completed",
      value: "completed",
    },
  ];
};

/**
 * Get Course Option
 * --------------------------
 */
export const GetExamCourseOpt = async (): Promise<ApiResponseType> => {
  try {
    const res = await HttpGetCourse("api/course");

    if (res.status === false) {
      return res;
    } else {
      const opt: SelectOptionType[] = [
        {
          key: "",
          value: "-- Course --",
        },
      ];

      res.data.data.forEach((row: CourseType) => {
        opt.push({
          key: row.id_course.toString(),
          value: row.name,
        });
      });

      return {
        status: true,
        message: "Course Option retrieved successfully",
        data: opt,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: "App Error: " + error.message,
    };
  }
};

/**
 * Get Exam
 * --------------------------
 */
export const HttpGetExam = async (path: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["exam"],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam retrieved successfully",
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
 * Create & Update Exam
 * --------------------------
 */
export const HttpSaveExam = async (
  apiPath: string,
  method: string,
  data: ExamInputType
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
        message: "Exam save successfully",
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
 * Delete Exam
 * --------------------------
 */
export const HttpDeleteExam = async (
  id_exam: number,
  apiPath: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath + `?id_exam=${id_exam}`, {
      method: "DELETE",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Exam deleted successfully",
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
