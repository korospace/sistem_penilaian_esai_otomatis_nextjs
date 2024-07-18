// types
import { CourseInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Course
 * --------------------------
 */
export const HttpGetCourse = async (path: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["course"],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Course retrieved successfully",
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
      message: "App Error: " + error.message,
    };
  }
};

/**
 * Create & Update Course
 * --------------------------
 */
export const HttpSaveCourse = async (
  apiPath: string,
  method: string,
  data: CourseInputType
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
        message: "Course save successfully",
        data: resJson,
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
 * Delete Course
 * --------------------------
 */
export const HttpDeleteCourse = async (
  id_course: number,
  apiPath: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath + `?id_course=${id_course}`, {
      method: "DELETE",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Course deleted successfully",
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
