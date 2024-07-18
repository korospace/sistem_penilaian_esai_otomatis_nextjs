// prisma
import { prisma } from "@/lib/db/init";
// types
import { ApiResponseType } from "@/lib/types/ResultTypes";

/**
 * Get Exam Answer
 * -------------------------------
 */
export async function GetSynonym(): Promise<ApiResponseType> {
  try {
    // -- get rows --
    const listSynonym = await prisma.synonym.findMany({});

    return {
      status: true,
      code: 200,
      message: "synonym list",
      data: listSynonym,
    };
  } catch (error: any) {
    return { status: false, code: 500, message: error.message };
  }
}
