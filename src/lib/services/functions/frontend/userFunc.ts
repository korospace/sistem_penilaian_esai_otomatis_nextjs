// types
import { UserInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get User
 * --------------------------
 */
export const HttpGetUser = async (path: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: ["user"],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Data retrieved successfully",
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
 * Create & Update User
 * --------------------------
 */
export const HttpSaveUser = async (
  apiPath: string,
  method: string,
  data: UserInputType
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
        message: "Data save successfully",
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
 * Delete User
 * --------------------------
 */
export const HttpDeleteUser = async (
  id_user: number,
  apiPath: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + apiPath + `?id_user=${id_user}`, {
      method: "DELETE",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Data deleted successfully",
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
