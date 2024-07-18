import { ApiResponseType } from "@/lib/types/ResultTypes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

/**
 * Get Autocomplete
 * -----------------------------
 */
export const HttpGetAutocomplete = async (
  path: string,
  tag: string
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(baseUrl + path, {
      method: "GET",
      next: {
        tags: [tag],
      },
      // cache: "force-cache",
    });

    const resJson = await res.json();

    if (res.ok) {
      return {
        status: true,
        message: "Autocomplete retrieved successfully",
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
