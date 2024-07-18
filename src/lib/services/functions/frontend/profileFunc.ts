// types
import { UserInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Profile
 * --------------------------
 */
export const HttpGetProfile = async (): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + "api/profile", {
      method: "GET",
      next: {
        tags: ["user"],
      },
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Profile retrieved successfully",
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
 * Update Profile
 * --------------------------
 */
export const HttpUpdateProfile = async (
  data: UserInputType
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + "api/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Profile update successfully",
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
