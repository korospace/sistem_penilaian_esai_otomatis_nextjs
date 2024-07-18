// nextjs
import { NextRequest } from "next/server";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
import { EssayCorrection } from "@/lib/helpers/essay_correction";
// validation
import { LevInputValidation } from "@/lib/validation/request";

/**
 * Get Result Lev
 * -------------------------
 */
export async function POST(request: NextRequest) {
  // json
  const req = await request.json();

  // validation
  const validationResult = LevInputValidation.safeParse(req);

  if (!validationResult.success) {
    return ResponseFormating.json(
      "validation failed",
      400,
      ResponseFormating.zodErrors(validationResult.error)
    );
  }

  // logic
  const lev = await EssayCorrection.lev(req.string2, req.string1);

  // response api
  return ResponseFormating.json("lev result", 200, lev);
}
