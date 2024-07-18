// prisma
import { prisma } from "@/lib/db/init";
// helpers
import { HashText } from "@/lib/helpers/helpers";
// types
import { LoginInputType } from "@/lib/types/InputTypes";
import { ApiResponseType } from "@/lib/types/ResultTypes";

export async function Login(
  dataInput: LoginInputType
): Promise<ApiResponseType> {
  try {
    // check username exist
    const dtUser = await prisma.user.findFirst({
      where: {
        username: dataInput.username,
      },
    });

    if (dtUser == null) {
      return {
        status: false,
        code: 401,
        message: "invalid username or password",
      };
    } else {
      // confirm password
      const confirmPass = HashText.compare(dataInput.password, dtUser.password);

      if (!confirmPass) {
        return {
          status: false,
          code: 401,
          message: "invalid username or password",
        };
      } else {
        return {
          status: true,
          code: 200,
          message: "login successfully",
          data: dtUser,
        };
      }
    }
  } catch (error: any) {
    return { status: true, code: 500, message: error.message };
  }
}
